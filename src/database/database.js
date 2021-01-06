const mongoose = require('mongoose');
module.exports = mongoose.connect('mongodb://localhost:27017/BabyBotDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
