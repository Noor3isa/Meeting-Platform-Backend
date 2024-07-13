const Room = require('../models/Room');
const Record = require('../models/Record');

const generateReport = async (room_id) => {
    try {
        // Fetch records for the given room_id
        const record = await Record.findOne({ room_id: room_id }).exec();
        const room = await Room.findOne({room_id: room_id}).exec();
        if (!record) {
            throw new Error('No records found for this room');
        }

        // Initialize variables for aggregation
        let totalEffectiveAttendance = 0;
        let totalEngagementLevels = 0;
        let totalEngagedUsers = 0;
        let totalDisengagedUsers = 0;
        let totalPositiveBodyLanguage = 0;
        let totalOpenedTabs = 0;
        let userCount = record.records.length; // Use length of records array to get user count
        let startTime = new Date(room.created_at);
        let endTime = new Date(room.ended_at);

        // Iterate through each user's record
        record.records.forEach(userRecord => {
            // Calculate effective attendance
            const effectiveAttendanceParts = userRecord.effective_attendance.split(' ');
            const hours = parseInt(effectiveAttendanceParts[0]);
            const minutes = parseInt(effectiveAttendanceParts[2]);
            const seconds = parseInt(effectiveAttendanceParts[4]);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            totalEffectiveAttendance += totalSeconds;

            // Aggregate engagement levels
            const engagementLevels = userRecord.engaged_frames / userRecord.total_frames;
            totalEngagementLevels += engagementLevels;

            // Determine if mostly engaged or not engaged
            if (engagementLevels >= 0.75) {
                totalEngagedUsers++;
            } else {
                totalDisengagedUsers++;
            }

            // Aggregate positive body language
            totalPositiveBodyLanguage += userRecord.total_body_language_positive / userRecord.total_frames;

            // Aggregate total opened tabs
            // totalOpenedTabs += userRecord.total_ext_tabs;
        });

        // Calculate average effective attendance
        const averageEffectiveAttendance = totalEffectiveAttendance / userCount;
        const totalMeetingDuration = endTime - startTime;
        const effectiveAttendancePercentage = averageEffectiveAttendance / totalMeetingDuration;
        // const formattedEffectiveAttendance = convertSecondsToHHMMSS(averageEffectiveAttendance);

        // Calculate average engagement levels
        const averageEngagementLevels = totalEngagementLevels / userCount;

        // Calculate mostly engaged percentage
        const mostlyEngagedPercentage = (totalEngagedUsers / userCount) * 100;

        // Calculate not engaged percentage
        const notEngagedPercentage = (totalDisengagedUsers / userCount) * 100;

        // Calculate average positive body language percentage
        const percentagePositiveBodyLanguage = totalPositiveBodyLanguage / userCount;

        // Construct update object for Room collection
        const updateObject = {
            effective_attendance: effectiveAttendancePercentage,
            engagement_levels: averageEngagementLevels,
            mostly_engaged: mostlyEngagedPercentage,
            not_engaged: notEngagedPercentage,
            positive_body_language: percentagePositiveBodyLanguage,
            opened_tabs: totalOpenedTabs
        };

        // Update Room collection for the given room_id
        const updatedRoom = await Room.updateOne({ room_id }, { $set: updateObject });

        if (!updatedRoom) {
            throw new Error('Room could not be updated');
        }

        console.log('Room updated successfully:', updatedRoom);
        return updatedRoom;
    } catch (error) {
        console.error('Error generating report:', error.message);
        throw error;
    }
};

// Helper function to convert seconds to "HH h MM m SS s" format
function convertSecondsToHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} h ${minutes} m ${seconds} s`;
}

module.exports = {generateReport};
