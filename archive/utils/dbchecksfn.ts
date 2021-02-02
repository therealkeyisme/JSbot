const EventModel = require('../database/models/eventSchema');
const ReminderModel = require('../database/models/remindSchema');
const Discord = require('discord.js');
import { EventType, ReminderType } from './types';

export const checkDbEvents = async (client: any) => {
  const today: any = new Date(Date.now());
  try {
    let eventDocument = await EventModel.findOne();
    if (eventDocument) {
      let events: Array<EventType> = eventDocument.events;
      let newEventList = [];
      for (let i = 0; i < events.length; i++) {
        let currentEvent: EventType = events[i];
        let accepted = currentEvent.accepted;
        if (accepted.length > 0) {
          let { date } = currentEvent;
          let guildid: string = currentEvent.guildid;
          let guildObj: any = await client.guilds.fetch(guildid);
          let guildTitle: string = guildObj.name;
          let datenowdifference: number = date - today;
          if (datenowdifference <= 1800000 && accepted.length > 0) {
            for (let j = 0; j < accepted.length; j++) {
              let user = await client.users.fetch(accepted[j].userid);
              let notified = accepted[j].notified;
              if (!notified) {
                let dmChannel = await user.createDM();
                let returnEmbed = new Discord.MessageEmbed()
                  .setTitle('Reminder: Event starting in less than 30 minutes')
                  .setDescription(
                    `${currentEvent.title} in ${guildTitle} is starting in just under 30 minutes.`,
                  )
                  .setColor('#63d6ff');
                await dmChannel.send(returnEmbed);
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
      await eventDocument.updateOne(updatedEventObject);
    }

    let rmdDocument = await ReminderModel.findOne();
    if (rmdDocument) {
      let reminders: Array<ReminderType> = rmdDocument.reminders;
      let newReminderList: Array<ReminderType> = [];
      for (let i = 0; i < reminders.length; i++) {
        let currentReminder: ReminderType = reminders[i];
        let notified = currentReminder.notified;
        let date = currentReminder.date;
        let guildid = currentReminder.guildid;
        let channelid = currentReminder.guildid;
        let user = currentReminder.user;
        let title = currentReminder.title;
        let datenowdifference = date - today;
        let reminderChannel = await client.channels.fetch(channelid);
        if (!notified && datenowdifference < 1000) {
          reminderChannel.send(
            `Hey <@${user}>, someone told me to remind you to remind me that you need to remember the following: ${title}`,
          );
          currentReminder.notified = true;
        }
        // console.log(currentReminder);
        if (!notified || datenowdifference > -1000) {
          newReminderList.push(currentReminder);
        }
      }
      // console.log(newReminderList);
      let updatedReminderObject = { events: newReminderList };
      await rmdDocument.updateOne(newReminderList);
    }
  } catch (err) {
    console.log(err);
  }
};
