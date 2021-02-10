import { Guild, Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

export default class NowPlaying extends BaseCommand {
  constructor() {
    super("nowplaying", "music", ["np"]);
  }

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
