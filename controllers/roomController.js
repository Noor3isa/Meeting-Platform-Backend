const Room = require('../models/Room');

const handleRoom = async (req, res) => {
    const {room_id, host_name, created_at} = req.body;
    if (!room_id || !host_name || !created_at) return res.sendStatus(400); // bad request
    try{
        const newRoom = await Room.create({
            "room_id": room_id,
            "host_name": host_name,
            "created_at": new Date(created_at).toISOString(),
            "participants_ids": [host_name]
    });
    res.sendStatus(201);
    } catch(err) {
        res.status(500).json({'error': err.message});
    }
}

module.exports = { handleRoom };