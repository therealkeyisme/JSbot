const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    events: [{
        guildid: String,
        title: String,
        date: Date,
        description: String,
        messageid: String,
        accepted: [{
            userid: String,
            nickname: String,
            notified: Boolean
        }],
        declined: [{
            userid: String,
            nickname: String
        }],
        tentative: [{
            userid: String,
            nickname: String
        }]
    }]
})

const EventModel = (module.exports = mongoose.model(
    'eventlist',
    EventSchema,
));