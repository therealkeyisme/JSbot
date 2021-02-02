"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleReactions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
class RoleReactions {
    constructor() {
        const schema = new mongoose_2.Schema({
            messageId: { type: String, required: true },
            emojiRoleMappings: { type: mongoose_1.default.Schema.Types.Mixed },
        });
        this._model = mongoose_2.model('message', schema);
    }
    get model() {
        return this._model;
    }
}
exports.RoleReactions = RoleReactions;
