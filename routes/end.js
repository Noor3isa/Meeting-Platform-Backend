// When the meeting has ended, that's when we invoke the summary maker!
const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

router.get('/', summaryController.handleSummary);

module.exports = router;