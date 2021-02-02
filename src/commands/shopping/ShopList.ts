import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class ShopList extends BaseCommand {
  constructor() {
    super("shoplist", "shopping", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    const dbRejectionMessage: string =
      "I was not able to find your shopping list, try adding something";
    let shopDocument = await DB.Models.Shopping.findOne({
      guildId: guildid,
    });
    if (!shopDocument) {
      shopDocument = new DB.Models.Shopping({
        guildId: guildid,
        shoppinglist: [],
      });
      await shopDocument.save();
      await message.channel.send(dbRejectionMessage);
      return;
    }
    let shoppingList: Array<string> = shopDocument.shoppinglist;
    shoppingList.sort();
    let dbAcceptMessage = new MessageEmbed({
      title: "Your shopping list:",
      color: "#63d6ff",
      description: "```" + shoppingList.join("\n") + "```",
    });
    message.channel.send(dbAcceptMessage);
  }
}
