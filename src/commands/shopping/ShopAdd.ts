import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import BaseCommand from "../../utils/structures/BaseCommand";
import { IShopping } from "../../database/models/ShoppingSchema";

export default class ShopAdd extends BaseCommand {
  constructor() {
    super("shopadd", "shopping", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    let argString = args.join(" ");
    args = argString.split(",");
    let intakeList: Array<string> = [];
    for (let i = 0; i < args.length; i++) intakeList.push(args[i].trim());
    let shopDocument: IShopping = await DB.Models.Shopping.findOne({
      guildId: guildid,
    });
    if (!shopDocument) {
      shopDocument = new DB.Models.Shopping({
        guildId: guildid,
        shoppinglist: intakeList,
      });
      await shopDocument.save();
      message.channel.send("Added your items to the shopping list");
      return;
    }
    let shoppingList = shopDocument.shoppinglist;
    for (let i = 0; i < intakeList.length; i++) {
      const element = intakeList[i];
      if (!shoppingList.includes(element)) shoppingList.push(element);
    }
    shopDocument.shoppinglist = shoppingList;
    await shopDocument.updateOne(shopDocument);
    message.channel.send("Added your items to the shopping list");
  }
}
