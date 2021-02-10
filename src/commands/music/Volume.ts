import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

/**
 * Creates command that changes the volume of the music playing
 *
 * @export Volume
 * @class Volume
 * @extends {BaseCommand}
 */
export default class Volume extends BaseCommand {
  /**
   * Creates an instance of Volume.
   * @memberof Volume
   */
  constructor() {
    super("volume", "music", []);
  }

  /**
   * Function that changes the volume parameter
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Volume
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    const channel = message.member.voice.channel;
    if (!channel) return;
    const serverQueue: QueueType = client.queue.get(guildid);
    if (!serverQueue) return;
    if (args.length === 0) {
      message.channel.send(`The current volume is: ${serverQueue.volume}`);
      return;
    }
    const newVolume: number = parseInt(args[0]);
    if (newVolume > 10) {
      message.channel.send("If you set the volume that high you will die.");
      return;
    } else {
      serverQueue.volume = newVolume;
      serverQueue.connection.dispatcher.setVolumeLogarithmic(newVolume / 10);
      message.channel.send(`I set the volume to : ${args[0]}`);
      return;
    }
  }
}
