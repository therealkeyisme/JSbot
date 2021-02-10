import { Guild, Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

/**
 * Creates a pause command
 *
 * @export Pause
 * @class Pause
 * @extends {BaseCommand}
 */
export default class Pause extends BaseCommand {
  /**
   * Creates an instance of Pause.
   * @memberof Pause
   */
  constructor() {
    super("pause", "music", []);
  }

  /**
   * Function that pauses the currently playing music
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Pause
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guild: Guild = message.guild;
    const guildid: string = guild.id;
    const serverQueue: QueueType = client.queue.get(guildid);

    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      message.channel.send("Music has been paused!");
      return;
    }
    message.channel.send("There's nothing for me to pause.");
    return;
  }
}
