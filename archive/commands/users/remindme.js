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
const { regExpObj, isThisValid } = require('../../utils/regExpObj');
const RemindModel = require('../../database/models/remindSchema');
const { findDate } = require('../../utils/commands/eventfn');
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (args == '?remindme') {
            return message.channel.send("I cannot remind you if you don't tell me when to do so");
        }
        try {
            const GUILDID = message.guild.id;
            const CHANNELID = message.channel.id;
            const USERID = message.author.id;
            const TITLE = args.split(', ')[1];
            const valid = isThisValid(args);
            if (!valid)
                return message.channel.send('That is not a valid input');
            let rmdDocument = yield RemindModel.findOne();
            let date = findDate(args);
            if (date == false) {
                return message.channel.send('That is not a valid input, try the help command to see a valid input');
            }
            let returnDate = {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                amOrPm: 'am',
            };
            if (returnDate.hour > 12) {
                returnDate.amOrPm = 'pm';
                returnDate.hour -= 12;
            }
            let returnMinute = returnDate.minute;
            if (returnMinute === 0) {
                returnMinute = '00';
            }
            message.channel.send(`Okay I will remind you on ${returnDate.month}/${returnDate.day}/${returnDate.year} at ${returnDate.hour}:${returnMinute} ${returnDate.amOrPm}`);
            if (!rmdDocument) {
                let dbModel = new RemindModel({
                    reminders: [
                        {
                            guildid: GUILDID,
                            channelid: CHANNELID,
                            title: TITLE,
                            date: date,
                            user: USERID,
                            notified: false,
                        },
                    ],
                });
                yield dbModel.save();
            }
            else {
                let reminderList = rmdDocument.reminders;
                reminderList.push({
                    guildid: GUILDID,
                    channelid: CHANNELID,
                    title: TITLE,
                    date: date,
                    user: USERID,
                    notified: false,
                });
                let newReminderList = { reminders: reminderList };
                yield rmdDocument.updateOne(newReminderList);
                console.log(reminderList);
            }
            console.log(date);
            console.log(date.getHours());
        }
        catch (err) {
            console.log(err);
        }
    }),
    aliases: ['reminder', 'remind'],
    description: '',
};
