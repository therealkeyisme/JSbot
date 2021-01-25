const EventModel = require('../../database/models/eventSchema');
const { regExpObj } = require('../regExpObj');
// const { regExpObj } = require('../regExpObj');

let informationFromUser = async (dmChannel, embed, filter) => {
  await dmChannel.send({ embed });
  let collected = await dmChannel.awaitMessages(filter, {
    max: 1,
    time: 30000,
  });
  return collected.first().content;
};

let findDate = (startTime) => {
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
  let weekDayNumber;
  // Testing to see if a day of the week is chosen
  if (regExpObj.allWeekDays.test(startTime)) {
    console.log('weekdays');
    eventDay = regExpObj.allWeekDays.exec(startTime)[1];
    for (let i = 0; i < weekdays.length; i++) {
      if (weekdays[i] === eventDay) weekDayNumber = i + 1;
    }
    if (weekDayNumber < todayDay || weekDayNumber === todayDay) {
      weekDayNumber += 7;
    }
    eventDate = weekDayNumber - todayDay + todayDate;
  } else if (regExpObj.date.test(startTime)) {
    console.log(regExpObj.date.exec(startTime));
    eventYear = regExpObj.date.exec(startTime)[4];
    eventMonth = parseInt(regExpObj.date.exec(startTime)[1]) - 1;
    eventDate = regExpObj.date.exec(startTime)[3];
  } else if (regExpObj.tomorrow.test(startTime)) {
    eventDate = todayDate + 1;
  } else if (regExpObj.today.test(startTime)) {
    eventDate = todayDate;
  } else {
    return false;
  }
  // Testing to see if its am or pm... then if it is then which one
  if (regExpObj.amOrPm.test(startTime)) {
    console.log('am or pm');
    eventHours = parseInt(regExpObj.amOrPm.exec(startTime)[1]);
    eventMinutes = parseInt(regExpObj.amOrPm.exec(startTime)[2]);
    if (regExpObj.pm.test(startTime)) {
      eventHours += 12;
    }
    if (!eventMinutes) {
      eventMinutes = 0;
    }
  } else if (regExpObj.time24hr.test(startTime)) {
    console.log('24hr');
    eventHours = regExpObj.time24hr.exec(startTime)[1];
    eventMinutes = regExpObj.time24hr.exec(startTime)[2];
  } else {
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

let dbAnalysis = async (
  eventDocument,
  GUILDID,
  title,
  description,
  eventEmbed,
  event,
) => {
  if (!eventDocument) {
    let dbModel = new EventModel({
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
    await dbModel.save();
  } else {
    let eventList = eventDocument.events;
    eventList.push({
      title: title,
      date: event,
      description: description,
      messageid: eventEmbed.id,
    });
    await dbUpdate(eventDocument, eventList);
  }
};

let dbUpdate = async (eventDocument, eventList) => {
  let newEventList = { events: eventList };
  await eventDocument.updateOne(newEventList);
};

module.exports = {
  informationFromUser,
  findDate,
  dbAnalysis,
  dbUpdate,
};
