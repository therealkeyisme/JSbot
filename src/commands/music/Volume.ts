import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

export default class Volume extends BaseCommand {
  constructor() {
    super("volume", "music", []);
  }

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
