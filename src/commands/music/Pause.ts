import { Guild, Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

export default class Pause extends BaseCommand {
  constructor() {
    super("pause", "music", []);
  }

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
