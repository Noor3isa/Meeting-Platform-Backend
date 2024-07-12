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
        type: Date,
        required: true
    },
    ended_at: {
        type: Date,
        required: false
    },
    participants_ids: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Room', roomSchema);
