const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.route('/')
    .get(usersController.getAllUsers) // GET /user/ => json that includes all users
    .delete(usersController.deleteUser); // DELETE /user/ => delete the user that's in the body

router.route('/:username/:room_id?') // Optional room_id
    .get(usersController.getUser); // if only username sent, we send back all room_ids
                                    // if room_id sent, then we send this room's report data

module.exports = router;