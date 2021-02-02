"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbUpdate = exports.dbModelSaver = void 0;
const database_1 = require("../../database/database");
const dbModelSaver = (GUILDID, items, lastTimeListed) => __awaiter(void 0, void 0, void 0, function* () {
    let dbShopModel = new database_1.DB.Models.Shopping({
        serverId: GUILDID,
        shoppinglist: items,
        lastShopList: lastTimeListed,
    });
    dbShopModel.save();
});
exports.dbModelSaver = dbModelSaver;
const dbUpdate = (shopDocument, shopList) => __awaiter(void 0, void 0, void 0, function* () {
    let newShopList = { shoppinglist: shopList };
    yield shopDocument.updateOne(newShopList);
});
exports.dbUpdate = dbUpdate;
module.exports = {
    dbModelSaver: exports.dbModelSaver,
    dbUpdate: exports.dbUpdate,
};
