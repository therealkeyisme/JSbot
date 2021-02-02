"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preferences = void 0;
const mongoose_1 = require("mongoose");
class Preferences {
    constructor() {
        const schema = new mongoose_1.Schema({
            guildid: { type: String, required: true },
            eventChannel: String,
        });
        this._model = mongoose_1.model('guildPrefs', schema);
    }
    get model() {
        return this._model;
    }
}
exports.Preferences = Preferences;
