"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mongoose_1 = require("mongoose");
const roleSchema_1 = require("./models/roleSchema");
const eventSchema_1 = require("./models/eventSchema");
const prefSchema_1 = require("./models/prefSchema");
const remindSchema_1 = require("./models/remindSchema");
const shoppingSchema_1 = require("./models/shoppingSchema");
const timerSchema_1 = require("./models/timerSchema");
let mongoURL = process.env.MONGO_URL;
if (!mongoURL) {
    mongoURL = 'mongodb://localhost:27017/BabyBotDB';
    console.log('NO URL');
}
class DB {
    constructor() {
        mongoose_1.connect(mongoURL, { useNewUrlParser: true });
        this._db = mongoose_1.connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);
        this._models = {
            Events: new eventSchema_1.Events().model,
            Preferences: new prefSchema_1.Preferences().model,
            Reminders: new remindSchema_1.Reminders().model,
            RoleReactions: new roleSchema_1.RoleReactions().model,
            Shopping: new shoppingSchema_1.Shopping().model,
            Timer: new timerSchema_1.Timer().model,
        };
    }
    static get Models() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance._models;
    }
    connected() {
        console.log('Connected to MongoDB');
    }
    error(err) {
        console.log('Mongoose has encountered an error', err);
    }
}
exports.DB = DB;
