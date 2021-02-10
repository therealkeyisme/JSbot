import { Message, VoiceChannel } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

/**
 * Creates a skip command that skips the currently playing song
 *
 * @export Skip
 * @class Skip
 * @extends {BaseCommand}
 */
export default class Skip extends BaseCommand {
  /**
   * Creates an instance of Skip.
   * @memberof Skip
   */
  constructor() {
    super("skip", "music", []);
  }

  /**
   * Function that the current song
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Skip
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid: string = message.guild.id;
    const channel: VoiceChannel = message.member.voice.channel;
    if (!channel) return;
    const serverQueue: QueueType = client.queue.get(guildid);
    if (!serverQueue) return;
    serverQueue.connection.dispatcher.end("Skip command has been used!");
  }
}
