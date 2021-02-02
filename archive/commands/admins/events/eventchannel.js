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
const database_1 = require("../../../database/database");
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const GUILDID = message.guild.id;
        const calledChannelId = message.channel.id;
        let prefDocument = yield database_1.DB.Models.Preferences.findOne({
            guildid: GUILDID,
        });
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send("You don't have permission to use that command.");
        }
        else {
            if (prefDocument) {
                let newEventChannel = { eventChannel: calledChannelId };
                yield prefDocument.updateOne(newEventChannel);
            }
            else {
                let dbPrefModel = new PrefModel({
                    guildid: GUILDID,
                    eventChannel: calledChannelId,
                });
                yield dbPrefModel.save();
            }
        }
    }),
    aliases: ['defaulteventchannel'],
    description: 'Sets the default event channel',
};
