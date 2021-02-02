import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class Shop extends BaseCommand {
  constructor() {
    super("shop", "shopping", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let embed = new MessageEmbed({
      title: "Shop help",
      color: "#63d6ff",
      fields: [
        {
          name: "`shopadd <item1>, <item2>`",
          value: "This adds something to your shopping list",
        },
        {
          name: "`shoprem <item1>, <item2>`",
          value: "This removes something from your shopping list",
        },
        {
          name: "`shoplist`",
          value: "Displays your shopping list",
        },
      ],
    });

    message.channel.send(embed);
  }
}
