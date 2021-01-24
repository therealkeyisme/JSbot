require('dotenv').config();
const mongoose = require('mongoose');
let mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
  mongoURL = 'mongodb://localhost:27017/BabyBotDB';
  console.log('NO URL');
}

module.exports = mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
