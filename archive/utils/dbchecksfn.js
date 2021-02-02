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
exports.checkDbEvents = void 0;
const EventModel = require('../database/models/eventSchema');
const ReminderModel = require('../database/models/remindSchema');
const Discord = require('discord.js');
const checkDbEvents = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date(Date.now());
    try {
        let eventDocument = yield EventModel.findOne();
        if (eventDocument) {
            let events = eventDocument.events;
            let newEventList = [];
            for (let i = 0; i < events.length; i++) {
                let currentEvent = events[i];
                let accepted = currentEvent.accepted;
                if (accepted.length > 0) {
                    let { date } = currentEvent;
                    let guildid = currentEvent.guildid;
                    let guildObj = yield client.guilds.fetch(guildid);
                    let guildTitle = guildObj.name;
                    let datenowdifference = date - today;
                    if (datenowdifference <= 1800000 && accepted.length > 0) {
                        for (let j = 0; j < accepted.length; j++) {
                            let user = yield client.users.fetch(accepted[j].userid);
                            let notified = accepted[j].notified;
                            if (!notified) {
                                let dmChannel = yield user.createDM();
                                let returnEmbed = new Discord.MessageEmbed()
                                    .setTitle('Reminder: Event starting in less than 30 minutes')
                                    .setDescription(`${currentEvent.title} in ${guildTitle} is starting in just under 30 minutes.`)
                                    .setColor('#63d6ff');
                                yield dmChannel.send(returnEmbed);
                                currentEvent.accepted[j].notified = true;
                                // accepted[j].notified = true
                            }
                        }
                    }
                    if (datenowdifference > -1800000) {
                        newEventList.push(currentEvent);
                    }
                }
            }
            let updatedEventObject = { events: newEventList };
            yield eventDocument.updateOne(updatedEventObject);
        }
        let rmdDocument = yield ReminderModel.findOne();
        if (rmdDocument) {
            let reminders = rmdDocument.reminders;
            let newReminderList = [];
            for (let i = 0; i < reminders.length; i++) {
                let currentReminder = reminders[i];
                let notified = currentReminder.notified;
                let date = currentReminder.date;
                let guildid = currentReminder.guildid;
                let channelid = currentReminder.guildid;
                let user = currentReminder.user;
                let title = currentReminder.title;
                let datenowdifference = date - today;
                let reminderChannel = yield client.channels.fetch(channelid);
                if (!notified && datenowdifference < 1000) {
                    reminderChannel.send(`Hey <@${user}>, someone told me to remind you to remind me that you need to remember the following: ${title}`);
                    currentReminder.notified = true;
                }
                // console.log(currentReminder);
                if (!notified || datenowdifference > -1000) {
                    newReminderList.push(currentReminder);
                }
            }
            // console.log(newReminderList);
            let updatedReminderObject = { events: newReminderList };
            yield rmdDocument.updateOne(newReminderList);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.checkDbEvents = checkDbEvents;
