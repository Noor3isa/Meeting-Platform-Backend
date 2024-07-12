const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for individual frames
const frameSchema = new Schema({
    frame_timestamp: {
        type: Date,
        required: true
    },
    is_engaged: {
        type: Boolean,
        required: true
    },
    body_language: {
        type: Boolean,
        required: true
    },
    ext_tabs: {
        type: Boolean,
        required: false
    }
}, { _id : false }); // Disabling _id for subdocuments

// Define the schema for room data including frames
const roomDataSchema = new Schema({
    room_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    frames: [frameSchema]
});

module.exports = mongoose.model('RoomData', roomDataSchema);
