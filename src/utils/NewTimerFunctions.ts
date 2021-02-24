import { MessageEmbed } from "discord.js";
import DiscordClient from "../client/client";
import { DB } from "../database/database";
import { IEvents } from "../database/models/EventSchema";
import { IReminders } from "../database/models/RemindSchema";

export const checkDBTimers = async (client: DiscordClient) => {
  const currentTime = new Date();
  const currentTimeNumber = (currentTime.getTime() - (currentTime.getTimezoneOffset() * 6000)) ;
  try {
    const eventDB = await DB.Models.Events.find();
    for (let eventIndex = 0; eventIndex < eventDB.length; eventIndex++) {
      const document: IEvents = eventDB[eventIndex];
      const accepted = document.accepted;
      const nowEventDifference = document.date - currentTimeNumber
      if (nowEventDifference <= 1800000) {
        for (
          let acceptedIndex = 0;
          acceptedIndex < accepted.length;
          acceptedIndex++
        ) {
          const acceptedInstance = accepted[acceptedIndex];
          if (!acceptedInstance.notified) {
            const user = await client.users.fetch(acceptedInstance.userid);
            const guild = await client.guilds.fetch(document.guildid);
            let dmChannel = await user.createDM();
            let returnEmbed = new MessageEmbed({
              title: "Reminder: Event starting in less than 30 minutes",
              description: `${document.title} in ${guild.name} is starting shortly. be there or be square.`,
              color: "#63d6ff",
            });
            await dmChannel.send(returnEmbed);
            document.accepted[acceptedIndex].notified = true;
          }
        }
        await document.updateOne(document)
      }
      
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const remindDB = await DB.Models.Reminders.find();
    for (let remindIndex = 0; remindIndex < remindDB.length; remindIndex++) {
      const document: IReminders = remindDB[remindIndex];
      const nowReminderDifference = document.date - currentTimeNumber;
      console.log(document.notified)
      if (nowReminderDifference <= 60000 && !document.notified) {
          const user = await client.users.fetch(document.user)
          const channel:any = await client.channels.fetch(document.channelid)
          channel.send(
            `Hey <@${user.id}> you told me to remind you to ${document.title}`
          );
          document.notified = true;
          await document.updateOne(document);
        
      }
    }
  } catch (error) {
    console.log(error);
  }
};
