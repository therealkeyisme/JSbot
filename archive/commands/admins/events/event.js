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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const eventfn_1 = require("../../../utils/commands/eventfn");
const database_1 = require("../../../database/database");
const regExpObj_1 = require("../../../utils/regExpObj");
module.exports = {
    run: (client, message) => __awaiter(void 0, void 0, void 0, function* () {
        if (!message.guild) {
            return;
        }
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            return message.channel.send("You don't have permission to use that command.");
        }
        const GUILDID = message.guild.id;
        // TODO: Make this go away once the dates are done
        const defaultFilter = (m) => m.content.startsWith('');
        const timeDateFiler = (m) => {
            let { allWeekDays, amOrPm, date, time24hr, tomorrow, now } = regExpObj_1.regExpObj;
            if (allWeekDays.test(m))
                return true;
            if (amOrPm.test(m))
                return true;
            if (date.test(m))
                return true;
            if (time24hr.test(m))
                return true;
            if (tomorrow.test(m))
                return true;
            if (now.test(m))
                return true;
        };
        let author = message.author;
        try {
            let dmChannel = yield author.createDM();
            let eventDocument = yield database_1.DB.Models.Events.findOne();
            let prefDocument = yield database_1.DB.Models.Preferences.findOne({
                guildid: GUILDID,
            });
            let embed = {
                title: 'Enter the event title',
                description: 'Please keep it short',
                color: '#63d6ff',
            };
            let title = yield eventfn_1.informationFromUser(dmChannel, embed, defaultFilter);
            embed = {
                title: 'Enter the event description',
                description: "Please don't make it too",
                color: '#63d6ff',
            };
            let description = yield eventfn_1.informationFromUser(dmChannel, embed, defaultFilter);
            // TODO: Add time zone support
            // embed = {
            //     title: "Enter timezone number",
            //     description: "If your time zone is missing use `?request.`"
            // };
            // let timeZone = await informationFromUser(dmChannel, embed);
            embed = {
                title: 'When should this event start?',
                description: '```Friday at 9pm\n Tomorrow at 18:00\n Now\n DD-MM-YYYY 7:00 PM```',
                color: '#63d6ff',
            };
            let startTime = (yield eventfn_1.informationFromUser(dmChannel, embed, timeDateFiler)).toLowerCase();
            let event = eventfn_1.findDate(startTime);
            let eventMinutes = event.getMinutes();
            let eventMonth = event.getMonth() + 1;
            if (eventMinutes === 0) {
                eventMinutes = '00';
            }
            let returnEmbed = new discord_js_1.default.MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .addFields({
                name: 'Time',
                value: `${event.getFullYear()}-${eventMonth}-${event.getDate()} ${event.getHours()}:${eventMinutes}`,
            }, { name: '✅Accepted', value: '-', inline: true }, { name: '🛑Declined', value: '-', inline: true }, { name: '❔Tentative', value: '-', inline: true })
                .setColor('#63d6ff');
            let eventEmbed;
            if (prefDocument) {
                let channelId = prefDocument.eventChannel;
                let eventChannel = yield client.channels.fetch(channelId);
                eventEmbed = yield eventChannel.send(returnEmbed);
            }
            else {
                eventEmbed = yield message.channel.send(returnEmbed);
            }
            yield eventEmbed.react('✅');
            yield eventEmbed.react('🛑');
            yield eventEmbed.react('❔');
            yield eventfn_1.dbAnalysis(eventDocument, GUILDID, title, description, eventEmbed, event);
        }
        catch (err) {
            console.log(err);
        }
    }),
    aliases: ['makeevent'],
    description: 'This is supposed to create an event',
};
