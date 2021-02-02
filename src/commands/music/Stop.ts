import { DiscordAPIError, Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class Stop extends BaseCommand {
  constructor() {
    super("Stop", "music", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    const channel = message.member.voice.channel;
    if (!channel) {
      return;
    }
    const serverQueue = client.queue.get(guildid);
    if (!serverQueue) return;
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
  }
}
