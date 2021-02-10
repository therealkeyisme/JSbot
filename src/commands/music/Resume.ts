import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

export default class Resume extends BaseCommand {
  constructor() {
    super("resume", "music", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    const serverQueue: QueueType = client.queue.get(guildid);

    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      message.channel.send("Resumed the music for you!");
      return;
    }
    message.channel.send("There is nothing playing.");
    return;
  }
}
