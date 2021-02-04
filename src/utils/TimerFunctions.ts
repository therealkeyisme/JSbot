import { MessageEmbed } from "discord.js";
import DiscordClient from "../client/client";
import { DB } from "../database/database";
import { IEvents } from "../database/models/EventSchema";

export const checkEventDB = async (client: DiscordClient) => {
  const currentTime = new Date(Date.now()).getTime();
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
    doc.update(doc);
  }
};
