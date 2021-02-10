import { DiscordAPIError, Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

/**
 * Creates a command that stops music and clears the queue
 *
 * @export Stop
 * @class Stop
 * @extends {BaseCommand}
 */
export default class Stop extends BaseCommand {
  /**
   * Creates an instance of Stop.
   * @memberof Stop
   */
  constructor() {
    super("Stop", "music", []);
  }

  /**
   * Function that stops music and clears the queue
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Stop
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    const channel = message.member.voice.channel;
    if (!channel) {
      return;
    }
    const serverQueue = client.queue.get(guildid);
    if (!serverQueue) return;
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
  }
}
