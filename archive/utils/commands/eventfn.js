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
exports.dbUpdate = exports.dbAnalysis = exports.findDate = exports.informationFromUser = void 0;
const database_1 = require("../../database/database");
const regExpObj_1 = require("../regExpObj");
// const { regExpObj } = require('../regExpObj');
const informationFromUser = (dmChannel, embed, filter) => __awaiter(void 0, void 0, void 0, function* () {
    yield dmChannel.send({ embed });
    let collected = yield dmChannel.awaitMessages(filter, {
        max: 1,
        time: 30000,
    });
    return collected.first().content;
});
exports.informationFromUser = informationFromUser;
const findDate = (startTime) => {
    const weekdays = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];
    const today = new Date(Date.now());
    const todayDay = today.getDay() + 1; // Day number
    const todayDate = today.getDate(); // Date number
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const todayHours = today.getHours();
    const todayMinutes = today.getMinutes();
    let event = today;
    let eventDay = todayDay;
    let eventDate = todayDate;
    let eventMonth = todayMonth;
    let eventYear = todayYear;
    let eventHours = todayHours;
    let eventMinutes = todayMinutes;
    let weekDayNumber = 0;
    // Testing to see if a day of the week is chosen
    if (regExpObj_1.regExpObj.allWeekDays.test(startTime)) {
        console.log('weekdays');
        eventDay = regExpObj_1.regExpObj.allWeekDays.exec(startTime)[1];
        for (let i = 0; i < weekdays.length; i++) {
            if (weekdays[i] === eventDay)
                weekDayNumber = i + 1;
        }
        if (weekDayNumber) {
            if (weekDayNumber < todayDay || weekDayNumber === todayDay) {
                weekDayNumber += 7;
            }
            eventDate = weekDayNumber - todayDay + todayDate;
        }
    }
    else if (regExpObj_1.regExpObj.date.test(startTime)) {
        console.log(regExpObj_1.regExpObj.date.exec(startTime));
        eventYear = regExpObj_1.regExpObj.date.exec(startTime)[4];
        eventMonth = parseInt(regExpObj_1.regExpObj.date.exec(startTime)[1]) - 1;
        eventDate = regExpObj_1.regExpObj.date.exec(startTime)[3];
    }
    else if (regExpObj_1.regExpObj.tomorrow.test(startTime)) {
        eventDate = todayDate + 1;
    }
    else if (regExpObj_1.regExpObj.today.test(startTime)) {
        eventDate = todayDate;
    }
    else {
        return false;
    }
    // Testing to see if its am or pm... then if it is then which one
    if (regExpObj_1.regExpObj.amOrPm.test(startTime)) {
        console.log('am or pm');
        eventHours = parseInt(regExpObj_1.regExpObj.amOrPm.exec(startTime)[1]);
        eventMinutes = parseInt(regExpObj_1.regExpObj.amOrPm.exec(startTime)[2]);
        if (regExpObj_1.regExpObj.pm.test(startTime)) {
            eventHours += 12;
        }
        if (!eventMinutes) {
            eventMinutes = 0;
        }
    }
    else if (regExpObj_1.regExpObj.time24hr.test(startTime)) {
        console.log('24hr');
        eventHours = regExpObj_1.regExpObj.time24hr.exec(startTime)[1];
        eventMinutes = regExpObj_1.regExpObj.time24hr.exec(startTime)[2];
    }
    else {
        return false;
    }
    event.setFullYear(eventYear);
    event.setMonth(eventMonth);
    event.setDate(eventDate);
    event.setHours(eventHours);
    event.setMinutes(eventMinutes);
    event.setSeconds(0);
    event.setMilliseconds(0);
    return event;
};
exports.findDate = findDate;
const dbAnalysis = (eventDocument, GUILDID, title, description, eventEmbed, event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!eventDocument) {
        let dbModel = new database_1.DB.Models.Events({
            events: [
                {
                    guildid: GUILDID,
                    title: title,
                    date: event,
                    description: description,
                    messageId: eventEmbed.id,
                    accepted: [],
                    declined: [],
                    tentative: [],
                },
            ],
        });
        yield dbModel.save();
    }
    else {
        let eventList = eventDocument.events;
        eventList.push({
            title: title,
            date: event,
            description: description,
            messageid: eventEmbed.id,
        });
        yield exports.dbUpdate(eventDocument, eventList);
    }
});
exports.dbAnalysis = dbAnalysis;
const dbUpdate = (eventDocument, eventList) => __awaiter(void 0, void 0, void 0, function* () {
    let newEventList = { events: eventList };
    yield eventDocument.updateOne(newEventList);
});
exports.dbUpdate = dbUpdate;
