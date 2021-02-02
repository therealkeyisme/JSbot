"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shopping = void 0;
const mongoose_1 = require("mongoose");
class Shopping {
    constructor() {
        const schema = new mongoose_1.Schema({
            serverId: { type: String, required: true },
            shoppinglist: [String],
            lastShopList: { type: String },
        });
        this._model = mongoose_1.model('shoppinglist', schema);
    }
    get model() {
        return this._model;
    }
}
exports.Shopping = Shopping;
