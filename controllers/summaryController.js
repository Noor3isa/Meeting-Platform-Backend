const Record = require('../models/Record');
const Room = require('../models/Room');
const Frame = require('../models/Frame');
const generateReport = require('./reportGenerationController');

const handleSummary = async (req, res) => {
    const { room_id, timestamp } = req.body;

    try {
        // Update the ended_at field in the Room document
        const endTime = new Date(timestamp).toISOString();
        const room = await Room.findOneAndUpdate(
            { room_id: room_id },
            { ended_at: endTime },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Extract usernames and add to participant_ids in Room, ensuring no duplicates
        const record = await Record.findOne({ room_id: room_id }).exec();

        if (!record) {
            return res.status(404).json({ error: 'No records found for this room' });
        }

        const participantIds = [];
        record.records.forEach(record => {
            participantIds.push(record.username);
        });
        room.participants_ids = participantIds;
        await room.save();

        // Update effective attendance, total frames, engaged frames, and body language
        const updateUserRecords = record.records.forEach(async userRecord => {
            const joinTimes = userRecord.join_times.map(time => new Date(time));
            const leaveTimes = userRecord.leave_times.map(time => new Date(time));

            // Calculate effective attendance
            let effectiveAttendanceMs = 0;
            for (let i = 0; i < joinTimes.length; i++) {
                const joinTime = joinTimes[i];
                const leaveTime = leaveTimes[i] || new Date(endTime); // Use endTime if leaveTime is not available
                effectiveAttendanceMs += leaveTime - joinTime;
            }

            // Convert milliseconds to hours, minutes, and seconds
            const totalSeconds = Math.floor(effectiveAttendanceMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            // Format as "HH h MM m SS s"
            userRecord.effective_attendance = `${hours} h ${minutes} m ${seconds} s`;
            effectiveAttendance = `${hours} h ${minutes} m ${seconds} s`;
        // Fetch frames from Frame collection
        const frames = await Frame.findOne({ room_id: room_id }).exec();

        if (!frames) {
            return res.status(404).json({ error: 'No frames found for this room' });
        }


            // Get user's frames
            const userFrames = frames.users.find(user => user.username === userRecord.username)?.frames || [];

            // Calculate total frames
            // userRecord.total_frames = userFrames.length;
            totalFrames = userFrames.length;
            
            // Calculate engaged frames and positive body language frames
            // userRecord.engaged_frames = userFrames.filter(frame => frame.is_engaged).length;
            engagedFrames = userFrames.filter(frame => frame.is_engaged).length;
            // userRecord.total_body_language_positive = userFrames.filter(frame => frame.body_language).length;
            positiveBodyLanguageFrames = userFrames.filter(frame => frame.body_language).length;
            
            // console.log(`User: ${userRecord.username}, Total Frames: ${userRecord.total_frames}, Engaged Frames: ${userRecord.engaged_frames}, Positive Body Language Frames: ${userRecord.total_body_language_positive}`);
            await Record.updateOne(
                { room_id: room_id, 'records.username': userRecord.username },
                {
                    $set: {
                        'records.$.effective_attendance': effectiveAttendance,
                        'records.$.total_frames': totalFrames,
                        'records.$.engaged_frames': engagedFrames,
                        'records.$.total_body_language_positive': positiveBodyLanguageFrames
                    }
                })
        });
        
        // await Promise.all(updateUserRecords);
        // record.markModified('records');
        // await record.save();

        // Generate report
        // await generateReport(room_id);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { handleSummary };
