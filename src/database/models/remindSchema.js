const mongoose = require('mongoose');
const ReminderSchema = new mongoose.Schema({
  reminders: [
    {
      guildid: String,
      channelid: String,
      title: String,
      date: Date,
      user: String,
      notified: Boolean,
    },
  ],
});

const ReminderModel = (module.exports = mongoose.model(
  'rmdlist',
  ReminderSchema,
));
