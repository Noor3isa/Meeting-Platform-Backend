const User = require('../models/User');
const Room = require('../models/Room');
const Report = require('../models/Report');

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

const getUser = async (req, res) => {
    const {username, room_id} = req.params;
    if (!req?.params?.username) return res.status(400).json({ "message": 'Username required' });
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
        const report = await Report.findOne({room_id: room_id}).exec();
        res.json(report);
    }
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser
}