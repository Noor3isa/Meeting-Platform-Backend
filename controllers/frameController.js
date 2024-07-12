const prompt = require('../config/prompt');
const Frame = require('../models/Frame');
const { getResponse, getJsonInference} = require('../services/gemeniApi');

// just for test
// const path = require('path');
// const fs = require('fs');
// const imgPath = './public/1.jpg';
// const image = {
//     inlineData:{
//         data: Buffer.from(fs.readFileSync(imgPath)).toString("base64"),
//         mimeType: (path.extname(imgPath).toLowerCase() == 'png')? "image/png" : "image/jpeg"
//     }
// };
// console.log(getInference(image));


const handleFrame = async (req, res) => {
    const {username, room_id, timestamp, base64_image} = req.body;
    if (!username || !room_id || !timestamp || !base64_image) return res.status(400).json({'error': 'Something went wrong with this frame'});
    try {
        const foundRoomFrames = await Frame.findOne({room_id: room_id}).exec();
        if (!foundRoomFrames){
            const newRoomFrames = await Frame.create({
                "room_id": room_id,
                "users": [
                    {
                        "username": username,
                        "frames": [
                            {
                                "frame_timestamp": new Date(timestamp).toISOString(),
                                "is_engaged": true,
                                "body_language": true,
                                "ext_tabs": null
                            }
                        ]
                    }
                ]
        });
        
        } 
        else if (foundRoomFrames) {
            const user = foundRoomFrames.users.find(user => user.username === username);
            if (!user) {
                user = {
                    "username": username,
                    "frames": [
                        {
                            "frame_timestamp": new Date(timestamp).toISOString(),
                            "is_engaged": true,
                            "body_language": true,
                            "ext_tabs": null
                        }
                    ]
                };
                
                foundRoomFrames.users.push(user);
                const result = await foundRoomFrames.save();
                console.log(result);
                
                
        } else if (user){
            const newFrame = {
                "frame_timestamp": new Date(timestamp).toISOString(),
                "is_engaged": true,
                "body_language": true,
                "ext_tabs": null
            }
            user.frames.push(newFrame);
            const result = await foundRoomFrames.save();
            console.log(result);
            // update inference
            
        }

        }
        // update inferences
        const room = await Frame.findOne({ room_id: room_id }).exec();

        if (!room) {
            console.log('Room not found');
            res.status(404).send('Room not found');
            return;
        }

        const user = room.users.find(user => user.username === username);

        if (!user) {
            console.log('User not found');
            res.status(404).send('User not found');
            return;
        }

        const frame_to_update = user.frames.find(frame => frame.frame_timestamp === new Date(timestamp).toISOString());

        if (!frame_to_update) {
            console.log('Frame not found');
            res.status(404).send('Frame not found');
            return;
        }

        const image = {
            inlineData: {
                data: base64_image,
                mimeType: "image/jpeg"
            }
        };

        setTimeout(async () => {
            const response = await getResponse(prompt, image);
            const jsonRes = await getJsonInference(response);
            const is_engaged = jsonRes.is_engaged;
            const body_language = jsonRes.body_language;

            frame_to_update.is_engaged = is_engaged;
            frame_to_update.body_language = body_language;

            const result = await room.save();
            console.log(`Saved result ${result}`);
            res.sendStatus(200);
        }, 1000);
    } catch(err){
        res.status(500).json({'error': err.message});
    }
}


module.exports = {handleFrame}
