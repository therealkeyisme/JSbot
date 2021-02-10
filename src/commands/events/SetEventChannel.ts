import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { DB } from "../../database/database";

/**
 * Sets the guild's default event channel in the guild preferences
 *
 * @export SetEventChannel
 * @class SetEventChannel
 * @extends {BaseCommand}
 */
export default class SetEventChannel extends BaseCommand {
  constructor() {
    super("setec", "events", ["seteventchannel"]);
  }

  /**
   * Function that adds current channel to the guild preferences as default event channel
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof SetEventChannel
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const channel = message.channel;
    const guild = message.guild;
    const guildid = guild.id;
    const returnMessage = "I have set this channel as your default channel";
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
    prefDocument.updateOne(prefDocument);
    channel.send(returnMessage);
  }
}
