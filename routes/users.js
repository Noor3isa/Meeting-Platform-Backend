const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.route('/')
    .get(usersController.getAllUsers) // GET /user/ => json that includes all users
    .delete(usersController.deleteUser); // DELETE /user/ => delete the user that's in the body

router.route('/:username/:room_id?') // Optional room_id
    .get(usersController.getReports); // if only username sent, we send back all room_ids
                                    // if room_id sent, then we send this room's report data

router.route('/:room_id') // GET /user/room_id => host_name
    .get(usersController.getUser);

module.exports = router;