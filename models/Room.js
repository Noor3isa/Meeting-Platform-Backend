const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for room data
const roomSchema = new Schema({
    room_id: {
        type: String,
        required: true,
        unique: true
    },
    host_name: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    ended_at: {
        type: String,
        required: false
    },
    participants_ids: {
        type: [String],
        required: true
    },
    effective_attendance: {
        type: String,
        default: null
    },
    engagement_levels: {
        type: Number,
        default: 0
    },
    mostly_engaged: {
        type: Number,
        default: 0
    },
    not_engaged: {
        type: Number,
        default: 0
    },
    positive_body_language: {
        type: Number,
        default: 0
    },
    opened_tabs: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Room', roomSchema);
