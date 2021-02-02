import { Message, VoiceChannel } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { QueueType } from "../../utils/structures/Structures";

export default class Skip extends BaseCommand {
  constructor() {
    super("skip", "music", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid: string = message.guild.id;
    const channel: VoiceChannel = message.member.voice.channel;
    if (!channel) return;
    const serverQueue: QueueType = client.queue.get(guildid);
    if (!serverQueue) return;
    serverQueue.connection.dispatcher.end("Skip command has been used!");
  }
}
