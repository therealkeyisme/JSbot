const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    events: [
        {
            title: String,
            date: Date,
            description: String,
            messageId: String
        }
    ]
})

const EventModel = (module.exports = mongoose.model(
    'eventlist',
    EventSchema,
));