"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const mongoose_1 = require("mongoose");
class Timer {
    constructor() {
        const schema = new mongoose_1.Schema({
            timers: [
                {
                    channelid: String,
                    date: Date,
                    user: String,
                },
            ],
        });
        this._model = mongoose_1.model('timerlist', schema);
    }
    get model() {
        return this._model;
    }
}
exports.Timer = Timer;
