import { Guild, Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

/**
 * Creates a now playing command
 *
 * @export NowPlaying
 * @class NowPlaying
 * @extends {BaseCommand}
 */
export default class NowPlaying extends BaseCommand {
  /**
   * Creates an instance of NowPlaying.
   * @memberof NowPlaying
   */
  constructor() {
    super("nowplaying", "music", ["np"]);
  }

  /**
   * Function to print out the song that is currently playing
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof NowPlaying
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guild: Guild | null = message.guild;
    const guildid: string = guild.id;
    const serverQueue: QueueType = client.queue.get(guildid);

    if (!serverQueue) {
      message.channel.send("There is nothing playing");
      return;
    }
    message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
  }
}
