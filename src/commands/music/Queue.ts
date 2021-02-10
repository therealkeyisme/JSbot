import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType, SongType } from "../../utils/structures/Structures";

/**
 * Creates a command that prints out the current queue
 *
 * @export Queue
 * @class Queue
 * @extends {BaseCommand}
 */
export default class Queue extends BaseCommand {
  /**
   * Creates an instance of Queue.
   * @memberof Queue
   */
  constructor() {
    super("queue", "music", []);
  }

  /**
   * Function that prints out the current queue
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Queue
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    const serverQueue: QueueType = client.queue.get(guildid);
    if (!serverQueue) {
      message.channel.send("There's nothing in the queue");
      return;
    }
    message.channel.send(
      `
__**Song queue:**__

${serverQueue.songs.map((song: SongType) => `**-** ${song.title}`).join("\n")}

**Now playing:** ${serverQueue.songs[0].title}
		`
    );
  }
}
