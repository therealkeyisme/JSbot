"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const mongoose_1 = require("mongoose");
class Events {
    constructor() {
        const schema = new mongoose_1.Schema({
            events: [
                {
                    guildid: String,
                    title: String,
                    date: Date,
                    description: String,
                    messageid: String,
                    accepted: [
                        {
                            userid: String,
                            nickname: String,
                            notified: Boolean,
                        },
                    ],
                    declined: [
                        {
                            userid: String,
                            nickname: String,
                        },
                    ],
                    tentative: [
                        {
                            userid: String,
                            nickname: String,
                        },
                    ],
                },
            ],
        });
        this._model = mongoose_1.model('eventlist', schema);
    }
    get model() {
        return this._model;
    }
}
exports.Events = Events;
