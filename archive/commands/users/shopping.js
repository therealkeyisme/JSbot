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
const database_1 = require("../../database/database");
const { dbModelSaver, dbUpdate } = require('../../utils/commands/shopdbfn');
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const GUILDID = message.guild.id;
            // message.delete({ timeout: 5000 });
            let command = args.split(' ')[0];
            let items = args.substr(4, args.length).split(', ');
            let shopDocument = yield database_1.DB.Models.Shopping.findOne({
                serverId: GUILDID,
            });
            let shopList;
            let lastTimeListed;
            if (shopDocument) {
                shopList = shopDocument.shoppinglist;
                lastTimeListed = shopDocument.lastShopList;
                if (lastTimeListed && shopList.length !== 0) {
                    try {
                        lastTimeListed = yield message.channel.messages.fetch(lastTimeListed);
                        lastTimeListed = yield lastTimeListed.unpin();
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
            else {
                shopList = [];
            }
            if (command.toLowerCase() === 'add') {
                if (!shopDocument) {
                    let lastTimeListed = '';
                    dbModelSaver(GUILDID, items, lastTimeListed);
                }
                else {
                    for (let i = items.length; i >= 0; i--) {
                        for (let k = 0; k < shopList.length; k++) {
                            if (shopList[k] === items[i]) {
                                items.splice(i, 1);
                                break;
                            }
                        }
                    }
                    shopList = shopList.concat(items);
                    dbUpdate(shopDocument, shopList);
                    // let newShopList = { shoppinglist: shopList}
                    // await shopDocument.updateOne(newShopList);
                }
                yield message.channel.send('I have added your things to the shopping list');
            }
            else if (command.toLowerCase() === 'rem') {
                if (!shopDocument) {
                    let items = [];
                    let newShopList = '';
                    dbModelSaver(GUILDID, items);
                }
                else {
                    for (let i = shopList.length; i >= 0; i--) {
                        for (let k = 0; k < items.length; k++) {
                            if (shopList[i] === items[k]) {
                                shopList.splice(i, 1);
                                break;
                            }
                        }
                    }
                    dbUpdate(shopDocument, shopList);
                }
                yield message.channel.send('I have removed those things from the shopping list');
            }
            else if (command.toLowerCase() === 'show' ||
                command.toLowerCase() == 'list') {
                if (!shopDocument || shopList.length == 0) {
                    if (!shopDocument) {
                        let items = [];
                        dbModelSaver(GUILDID, items);
                    }
                    let returnMessage = "I was not able to find your shopping list. I either lost it or you haven't given it to me yet.";
                    message.channel
                        .send(returnMessage)
                        .then((message) => message.delete({ timeout: 10000 }))
                        .catch((err) => {
                        throw err;
                    });
                }
                else {
                    let returnList = shopList.sort().join('\n');
                    let returnMessage = 'The following items are on your shopping list: \n ```\n' +
                        returnList +
                        '\n```';
                    let msg = message.channel.send(returnMessage);
                    yield msg.pin();
                    lastTimeListed = { lastShopList: msg.id };
                    yield shopDocument.updateOne(lastTimeListed);
                }
            }
            else if (command.toLowerCase() === 'clear') {
                if (!shopDocument) {
                    let items = [];
                    dbModelSaver(GUILDID, items);
                }
                else {
                    shopList = [];
                    dbUpdate(shopDocument, shopList);
                }
                yield message.channel.send('I have cleared the shopping list!');
            }
        }
        catch (err) {
            console.log(err);
        }
    }),
    aliases: ['shop'],
    description: 'Maintains and stores a shopping list',
};
