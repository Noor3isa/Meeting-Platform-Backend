const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for recording join and leave times
const recordSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    join_times: {
        type: [Date],
        required: true
    },
    leave_times: {
        type: [Date],
        required: false
    }
}, { _id : false }); // Disabling _id for subdocuments
const roomRecordSchema = new Schema({
    room_id: {
        type: String,
        required: true
    },
    records: [recordSchema]
});

module.exports = mongoose.model('Record', roomRecordSchema);
