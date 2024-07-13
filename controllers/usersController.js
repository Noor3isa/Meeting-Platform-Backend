const User = require('../models/User');
const Room = require('../models/Room');
const Record = require('../models/Record');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.username) return res.status(400).json({ 'message': 'Username required' });
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `Username ${req.body.username} not found` });
    }
    const result = await user.deleteOne({ username: req.body.username });
    res.json(result);
}

const getReports = async (req, res) => {
    const {username, room_id} = req.params;
    if (!req?.params?.username) return res.status(400).json({ "message": 'Username required' });
    try{
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `Username ${username} not found` });
    }
    if (!room_id) {
        // res.json(user);
        const rooms = await Room.find({ host_name: username }, 'room_id').exec(); // Find rooms with the specific host_name and only select room_id
        if (!rooms) return res.status(204).json({'message': `User ${username} did not create any rooms yet`});
        const email = await User.findOne({username: username}, 'email').exec();
        const response = {
            "username": username,
            "email": email,
            "report_ids": rooms
        }
        res.json(response);
    } else if(room_id){
        const room = await Room.findOne({room_id: room_id}).exec();
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const records = await Record.find({ room_id: room_id }).exec();

        if (!records) {
            return res.status(404).json({ error: 'No records found for this room' });
        }

        res.status(200).json({room, records});
    }
} catch(err) {
    res.status(500).json({'error': err.message});
}
}

const getUser = async (req, res) => {
    const {room_id} = req.params;
    if (!req?.params?.room_id) return res.status(400).json({ "message": 'Room ID required' });
    const room = await Room.findOne({ room_id: room_id }).exec();
    console.log(room);
    if (!room) {
        return res.status(204).json({ 'message': `Room ${room} not found` });
    }
    return res.status(200).json({"host": room.host_name});
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    getReports
}