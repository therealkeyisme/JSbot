const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    events: [{
        guildid: String,
        title: String,
        date: Date,
        description: String,
        messageid: String,
        attendees: [String]
    }]
})

const EventModel = (module.exports = mongoose.model(
    'eventlist',
    EventSchema,
));