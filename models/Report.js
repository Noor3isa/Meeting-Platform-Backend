const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for report data
const reportSchema = new Schema({
    room_id: {
        type: String,
        required: true
    },
    host_name: {
        type: String,
        required: true
    },
    effective_attendance: {
        type: Number,
        required: true
    },
    engagement_levels: {
        type: Number,
        required: true
    },
    mostly_engaged: {
        type: Number,
        required: true
    },
    not_engaged: {
        type: Number,
        required: true
    },
    body_language: {
        type: Number,
        required: true
    },
    opened_tabs: {
        type: Number,
        required: true
    },
    no_open_tabs: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Report', reportSchema);
