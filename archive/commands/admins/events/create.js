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
const EventModel = require('../../../database/models/eventSchema');
const PrefModel = require('../../../database/models/prefSchema');
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const GUILDID = message.guild.id;
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send("You don't have permission to use this command");
        }
        else {
            let prefDocument = yield PrefModel.findOne({ guildid: GUILDID });
            let newChannel = yield message.guild.channels.create('BabyBot Events', {
                type: 'text',
                topic: 'events',
            });
            console.log();
            if (prefDocument) {
                let newEventChannel = { eventChannel: newChannel.id };
                yield prefDocument.updateOne(newEventChannel);
            }
            else {
                let dbPrefModel = new PrefModel({
                    guildid: GUILDID,
                    eventChannel: newChannel.id,
                });
                yield dbPrefModel.save();
            }
        }
    }),
    aliases: ['createchannel'],
    description: 'Creates the default channel for events',
};
