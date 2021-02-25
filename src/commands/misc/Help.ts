import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class Help extends BaseCommand {
  constructor() {
    super("help", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let helpList = client.helpList();
    message.channel.send(helpList);
  }
}
