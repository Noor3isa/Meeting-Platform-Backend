const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ 'message': 'Username, Email and Password are all required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    }).exec();
    if (duplicate) return res.status(409).json({'message': 'There is already a user with the same user name or email.'}); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await User.create({
            "username": username,
            "email": email,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };