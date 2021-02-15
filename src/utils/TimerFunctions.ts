import { Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../client/client";
import { DB } from "../database/database";
import { IEvents } from "../database/models/EventSchema";
import { IReminders } from "../database/models/RemindSchema";
import { ITimer } from "../database/models/TimerSchema";

/**
 * Checks every document in the database to see if there is an event within the next 30 minutes
 *
 * @param {DiscordClient} client The Discord Client Class
 */
export const checkEventDB = async (client: DiscordClient) => {
  const currentTime = new Date(Date.now());
  console.log("Checking db");
  let doc: IEvents;
  let dbItems = await DB.Models.Events.find();
  for (doc of dbItems) {
    const eventDate = doc.date;
    let accepted = doc.accepted;
    if (
      eventDate.getTime() - currentTime.getTime() <= 1800000 &&
      accepted.length > 0
    ) {
      for (let i = 0; i < accepted.length; i++) {
        const user = await client.users.fetch(accepted[i].userid);
        const guild = await client.guilds.fetch(doc.guildid);
        let notified = accepted[i].notified;
        if (!notified) {
          let dmChannel = await user.createDM();
          let returnEmbed = new MessageEmbed({
            title: "Reminder: Event starting in less than 30 minutes",
            description: `${doc.title} in ${guild.name} is starting shortly. be there or be square.`,
            color: "#63d6ff",
          });
          await dmChannel.send(returnEmbed);
          accepted[i].notified = true;
        }
      }
    }
    doc.accepted = accepted;
    await doc.updateOne(doc);
  }
};

/**
 * Checks every document in the database to see if there is a reminder within 1 minute.
 * @param {DiscordClient} client The Discord Client Class
 */

export const checkRmdDB = async (client: DiscordClient) => {
  const currentTime = new Date(Date.now());
  console.log("checking rmd db");
  let doc: IReminders;
  let dbItems = await DB.Models.Reminders.find();
  for (doc of dbItems) {
    const rmdDate = doc.date;
    if (rmdDate.getTime() - currentTime.getTime() <= 120000 && !doc.notified) {
      const user = await client.users.fetch(doc.user);
      const channel: any = await client.channels.fetch(doc.channelid);
      channel.send(
        `Hey <@${user.id}> you told me to remind you to ${doc.title}`
      );
      doc.notified = true;
      await doc.updateOne(doc);
    }
  }
};

/**
 * Checks every document in the database to see if there is a timer within 1 minute.
 * @param {DiscordClient} client The Discord Client Class
 */
export const checkTimerDB = async (client: DiscordClient) => {
  const currentTime = new Date(Date.now());
  console.log("checking timer db");
  let doc: ITimer;
  let dbItems = await DB.Models.Timer.find();
  for (doc of dbItems) {
    const timerDate = doc.date;
    if (
      timerDate.getTime() - currentTime.getTime() <= 120000 &&
      !doc.notified
    ) {
      const user = await client.users.fetch(doc.user);
      const channel: any = await client.channels.fetch(doc.channelid);
      channel.send(`Hey <@${user.id}> your timer is going off`);
      doc.notified = true;
      await doc.updateOne(doc);
    }
  }
};

export /**
 * Handles the setInterval in index.ts. This makes sure that checkTimerDB, checkRmdDB and checkEventsDB all run every minute.
 *
 * @param {DiscordClient} client The Discord Client Class
 */
const runTimers = async (client: DiscordClient): Promise<void> => {
  await checkEventDB(client);
  await checkRmdDB(client);
  await checkTimerDB(client);
  return;
};
