const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

router.route('/join').post(recordController.handleJoinRecord);

router.route('/leave').post(recordController.handleLeaveRecord);

module.exports = router;