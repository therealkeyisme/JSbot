import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType, SongType } from "../../utils/structures/Structures";

export default class Queue extends BaseCommand {
  constructor() {
    super("queue", "music", []);
  }

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
