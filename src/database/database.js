const mongoose = require('mongoose');
module.exports = mongoose.connect('mongodb://localhost:27017/rolereaction', {useNewUrlParser: true, useUnifiedTopology: true});