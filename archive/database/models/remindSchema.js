"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reminders = void 0;
const mongoose_1 = require("mongoose");
class Reminders {
    constructor() {
        const schema = new mongoose_1.Schema({
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
        this._model = mongoose_1.model('rmdlist', schema);
    }
    get model() {
        return this._model;
    }
}
exports.Reminders = Reminders;
