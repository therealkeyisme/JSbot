const mongoose = require('mongoose');
const TimerSchema = new mongoose.Schema({
  timers: [
    {
      channelid: String,
      date: Date,
      user: String,
    },
  ],
});

const TimerModel = (module.exports = mongoose.model('timerList', TimerSchema));
