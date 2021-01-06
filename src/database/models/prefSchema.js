const mongoose = require('mongoose');
const PrefSchema = new mongoose.Schema({
    guildid: { type: String, required: true },
    eventChannel: String,
});

const PrefModel = (module.exports = mongoose.model('guildPrefs', PrefSchema));
