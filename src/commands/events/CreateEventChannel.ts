import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import BaseCommand from "../../utils/structures/BaseCommand";

/**
 * Creates an event channel
 *
 * @export CreateEC
 * @class CreateEC
 * @extends {BaseCommand}
 */
export default class CreateEC extends BaseCommand {
  /**
   * Creates an instance of CreateEC.
   * @memberof CreateEC
   */
  constructor() {
    super("createec", "events", ["createeventchannel"]);
    super.helpStatement = "`?createec` creates an event channel";
  }

  /**
   * Function that creates a discord channel and then adds it to the guild's preferences
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof CreateEC
   */
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
