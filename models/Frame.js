const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for individual frames
const frameSchema = new Schema({
    frame_timestamp: {
        type: String,
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
        default: false
    }
}, { _id : false }); // Disabling _id for subdocuments

// Define the schema for room data including frames
const usersSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    frames: [frameSchema]
}, { _id : false }); // Disabling _id for subdocuments

const roomDataSchema = new Schema({
    room_id: {
        type: String,
        required: true
    },
    users: [usersSchema]
});

module.exports = mongoose.model('RoomData', roomDataSchema);
