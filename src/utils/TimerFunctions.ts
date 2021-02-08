import { MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../client/client";
import { DB } from "../database/database";
import { IEvents } from "../database/models/EventSchema";
import { IReminders } from "../database/models/RemindSchema";
import { ITimer } from "../database/models/TimerSchema";
const currentTime = new Date(Date.now()).getTime();

/**
 * Checks every document in the database to see if there is an event within the next 30 minutes
 *
 * @param {DiscordClient} client the discord client class
 */
export const checkEventDB = async (client: DiscordClient) => {
  let doc: IEvents;
  for await (doc of DB.Models.Events.find()) {
    const eventDate = doc.date.getTime();
    let accepted = doc.accepted;
    let dateNowDifference = eventDate - currentTime;
    if (dateNowDifference <= 1800000 && accepted.length > 0) {
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
    console.log(doc);
    console.log(doc.accepted);
    await doc.updateOne(doc);
  }
};

export const checkRmdDB = async (client: DiscordClient) => {
  let doc: IReminders;
  for await (doc of DB.Models.Reminders.find()) {
    const rmdDate = doc.date.getTime();
    let dateNowDifference = rmdDate - currentTime;
    if (dateNowDifference <= 120000 && !doc.notified) {
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

export const checkTimerDB = async (client: DiscordClient) => {
  let doc: ITimer;
  for await (doc of DB.Models.Timer.find()) {
    const timerDate = doc.date.getTime();
    let dateNowDifference = timerDate - currentTime;
    if (dateNowDifference <= 120000 && !doc.notified) {
      const user = await client.users.fetch(doc.user);
      const channel: any = await client.channels.fetch(doc.channelid);
      channel.send(`Hey <@${user.id}> your timer is going off`);
      doc.notified = true;
      await doc.updateOne(doc);
    }
  }
};
