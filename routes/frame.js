const express = require('express');
const router = express.Router();
const frameController = require('../controllers/frameController');

router.post('/',frameController.handleFrame);

module.exports = router;