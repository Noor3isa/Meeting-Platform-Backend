const Record = require('../models/Record');

const handleJoinRecord = async (req, res) => {
    const {username, room_id, timestamp} = req.body;
    if (!username || !room_id || !timestamp) return sendStatus(400);
    try {
        const foundRecord = await Record.findOne({room_id: room_id}).exec();
        if (!foundRecord){
            const newRecord = await Record.create({
                "room_id": room_id,
                "records": [
                    {
                        "username": username,
                        "join_times": [new Date(timestamp).toISOString()],
                        "leave_times": []
                    }
                ]
        });
        res.sendStatus(201);
        } 
        else if (foundRecord) {
            const userRecord = foundRecord.records.find(record => record.username === username);
            if (!userRecord) {
                const newUserRecord = {
                    username: username,
                    join_times: [new Date(timestamp).toISOString()], // Initialize join_times array
                    leave_times: [] // Initialize leave_times array
                };
    
                foundRecord.records.push(newUserRecord);
                const result = await foundRecord.save();
                console.log(result);
                res.sendStatus(201);
        } else if (userRecord){
            userRecord.join_times.push(new Date(timestamp).toISOString());
            const result = await foundRecord.save();
            console.log(result);
            res.sendStatus(200);
        }

        }
    } catch(err) {
        res.status(500).json({'error': err.message});
    }
}


const handleLeaveRecord = async (req, res) => {
    const {username, room_id, timestamp} = req.body;
    if (!username || !room_id || !timestamp) return res.sendStatus(400);
    try {
        const foundRecord = await Record.findOne({room_id: room_id}).exec();
        if (!foundRecord){
            return res.status(400).json({'error': 'Wrong meeting ID'});
        } 
        else if (foundRecord) {
            const userRecord = foundRecord.records.find(record => record.username === username);
            if (!userRecord) {
                return res.status(400).json({'error': `User ${username} has not joined for them to leave`});
        } else if (userRecord){
            userRecord.leave_times.push(new Date(timestamp).toISOString());
            const result = await foundRecord.save();
            console.log(result);
            res.sendStatus(200);
        }
        }
    } catch(err) {
        res.status(500).json({'error': err.message});
    }
}


module.exports = {handleJoinRecord, handleLeaveRecord};