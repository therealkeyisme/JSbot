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
const database_1 = require("../../database/database");
const reactionaddfn_1 = require("../../utils/events/reactionaddfn");
module.exports = (client, reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (reaction.message.guild.members.cache.get(user.id).user.bot) {
        return;
    }
    let GUILDID = reaction.message.guild.id;
    let { id } = reaction.message;
    let emojiName = yield reaction.emoji.name;
    yield reaction.message.fetch();
    yield reactionaddfn_1.roleReactionAdd(client, reaction, user, id);
    let userNickname = reaction.message.guild.members.cache.get(user.id).nickname;
    if (!userNickname) {
        userNickname = reaction.message.guild.members.cache.get(user.id).user
            .username;
    }
    try {
        let eventDocument = yield database_1.DB.Models.Events.findOne();
        let events = eventDocument.events;
        let userObject = {
            userid: user.id,
            nickname: userNickname,
            notified: false,
        };
        let reactedEvent = events.find((obj) => obj.messageid === id);
        events.splice([events.indexOf(reactedEvent)]);
        if (reactedEvent) {
            let userAccepted = reactedEvent.accepted;
            let acceptedList = [];
            let userDeclined = reactedEvent.declined;
            let declinedList = [];
            let userTentative = reactedEvent.tentative;
            let tentativeList = [];
            if (!userAccepted)
                userAccepted = [];
            if (!userDeclined)
                userDeclined = [];
            if (!userTentative)
                userTentative = [];
            let eventDate = reactedEvent.date;
            let eventMinutes = eventDate.getMinutes();
            let eventMonth = eventDate.getMonth() + 1;
            let userAlreadyAccepted = false;
            let userAlreadyDeclined = false;
            let userAlreadyTentative = false;
            let indexUserAlreadyAccepted;
            let indexUserAlreadyDeclined;
            let indexUserAlreadyTentative;
            for (let i = 0; i < userAccepted.length; i++) {
                if (userAccepted[i].nickname === userNickname) {
                    userAlreadyAccepted = true;
                    indexUserAlreadyAccepted = i;
                }
            }
            for (let i = 0; i < userDeclined.length; i++) {
                if (userDeclined[i].nickname === userNickname) {
                    userAlreadyDeclined = true;
                    indexUserAlreadyDeclined = i;
                }
            }
            for (let i = 0; i < userTentative.length; i++) {
                if (userTentative[i].nickname === userNickname) {
                    userAlreadyTentative = true;
                    indexUserAlreadyTentative = i;
                }
            }
            if (emojiName === '✅') {
                if (!userAlreadyAccepted) {
                    userAccepted.push(userObject);
                    if (userAlreadyDeclined)
                        userDeclined.splice(indexUserAlreadyDeclined);
                    if (userAlreadyTentative)
                        userTentative.splice(indexUserAlreadyTentative);
                }
            }
            else if (emojiName === '🛑') {
                if (!userAlreadyDeclined) {
                    userDeclined.push(userObject);
                    if (userAlreadyAccepted)
                        userAccepted.splice(indexUserAlreadyAccepted);
                    if (userAlreadyTentative)
                        userTentative.splice(indexUserAlreadyTentative);
                }
            }
            else if (emojiName === '❔') {
                if (!userAlreadyTentative) {
                    userTentative.push(userObject);
                    if (userAlreadyAccepted)
                        userAccepted.splice(indexUserAlreadyAccepted);
                    if (userAlreadyDeclined)
                        userDeclined.splice(indexUserAlreadyDeclined);
                }
            }
            for (let i = 0; i < userAccepted.length; i++) {
                acceptedList.push(userAccepted[i].nickname);
            }
            for (let i = 0; i < userDeclined.length; i++) {
                declinedList.push(userDeclined[i].nickname);
            }
            for (let i = 0; i < userTentative.length; i++) {
                tentativeList.push(userTentative[i].nickname);
            }
            let acceptedString;
            let declinedString;
            let tentativeString;
            if (acceptedList.length !== 0) {
                acceptedString = acceptedList.join('\n');
            }
            else {
                acceptedString = '-';
            }
            if (declinedList.length !== 0) {
                declinedString = declinedList.join('\n');
            }
            else {
                declinedString = '-';
            }
            if (tentativeList.length !== 0) {
                tentativeString = tentativeList.join('\n');
            }
            else {
                tentativeString = '-';
            }
            let returnEmbed = new discord_js_1.default.MessageEmbed()
                .setTitle(reactedEvent.title)
                .setDescription(reactedEvent.description)
                .addFields({
                name: 'Time',
                value: `${eventDate.getFullYear()}-${eventMonth}-${eventDate.getDate()} ${eventDate.getHours()}:${eventMinutes}`,
            }, {
                name: '✅Accepted',
                value: acceptedString,
                inline: true,
            }, {
                name: '🛑Declined',
                value: declinedString,
                inline: true,
            }, {
                name: '❔Tentative',
                value: tentativeString,
                inline: true,
            })
                .setColor('#63d6ff');
            reaction.message.edit(returnEmbed);
            let newReactedEvent = {
                guildid: GUILDID,
                title: reactedEvent.title,
                date: eventDate,
                description: reactedEvent.description,
                messageid: reactedEvent.messageid,
                accepted: userAccepted,
                declined: userDeclined,
                tentative: userTentative,
            };
            events.push(newReactedEvent);
            let newEventList = { events: events };
            yield database_1.DB.Models.Events.updateOne(newEventList);
            yield reaction.users.remove(user.id);
        }
    }
    catch (err) {
        console.log(err);
    }
});
