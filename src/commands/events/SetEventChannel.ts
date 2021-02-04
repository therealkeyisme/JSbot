import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { DB } from "../../database/database";

export default class SetEventChannel extends BaseCommand {
  constructor() {
    super("setec", "events", ["seteventchannel"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const channel = message.channel;
    const guild = message.guild;
    const guildid = guild.id;
    const returnMessage = "I have set this channel as your default channel";
    console.log(message.guild.roles);
    let prefDocument = await DB.Models.Preferences.findOne({
      guildid: guildid,
    });
    if (!prefDocument) {
      prefDocument = new DB.Models.Preferences({
        guildid: guildid,
        eventChannel: channel.id,
      });
      await prefDocument.save();
      channel.send(returnMessage);
      return;
    }
    prefDocument.eventChannel = channel.id;
    console.log(prefDocument);
    prefDocument.updateOne(prefDocument);
    channel.send(returnMessage);
  }
}
