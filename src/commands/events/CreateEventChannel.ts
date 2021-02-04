import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class CreateEC extends BaseCommand {
  constructor() {
    super("createec", "events", ["createeventchannel"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    const newChannel = await message.guild.channels.create("baby-bot-events", {
      type: "text",
    });
    let prefDocument = await DB.Models.Preferences.findOne({
      guildid: guildid,
    });

    if (!prefDocument) {
      prefDocument = new DB.Models.Preferences({
        guildid: guildid,
        eventChannel: newChannel.id,
      });
      prefDocument.save();
      message.channel.send("New channel has been created");
      return;
    }
    prefDocument.eventChannel = newChannel.id;
    await prefDocument.updateOne(prefDocument);
    message.channel.send("New channel has been created");
  }
}
