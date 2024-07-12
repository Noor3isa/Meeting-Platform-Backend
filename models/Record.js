const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for recording join and leave times
const recordSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    join_times: {
        type: [String],
        required: true
    },
    leave_times: {
        type: [String],
        required: false
    },
    effective_attendance: {
        type: String,
        default: null
    },
    total_frames: {
        type: Number,
        default: 0
    },
    engaged_frames: {
        type: Number,
        default: 0
    },
    total_body_language_positive: {
        type: Number,
        default: 0
    },
    total_ext_tabs: {
        type: Number,
        default: 0
    } // Default to 0 if not provided
}, { _id : false }); // Disabling _id for subdocuments
const roomRecordSchema = new Schema({
    room_id: {
        type: String,
        required: true
    },
    records: [recordSchema]
});

module.exports = mongoose.model('Record', roomRecordSchema);
