const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for summary data
const summarySchema = new Schema({
    effective_attendance: {
        type: String,
        required: true
    },
    total_frames: {
        type: Number,
        required: true
    },
    engaged_frames: {
        type: Number,
        required: true
    },
    disengaged_frames: {
        type: Number,
        required: true
    },
    average_engagement_level: {
        type: Number,
        required: true
    },
    total_ext_tabs: {
        type: Number,
        required: true
    },
    total_body_language_positive: {
        type: Number,
        required: true
    },
    total_body_language_negative: {
        type: Number,
        required: false
    }
}, { _id : false }); // Disabling _id for subdocuments

// Define the schema for room summary data
const roomSummarySchema = new Schema({
    room_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    summary: summarySchema
});

module.exports = mongoose.model('RoomSummary', roomSummarySchema);
