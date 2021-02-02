import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { IShopping } from "../../database/models/ShoppingSchema";
import BaseCommand from "../../utils/structures/BaseCommand";
import ShopList from "./ShopList";

export default class ShopRem extends BaseCommand {
  constructor() {
    super("shoprem", "shopping", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    let argString = args.join(" ");
    args = argString.split(",");
    let intakeList: Array<string> = [];
    let returnList: Array<string> = [];
    for (let i = 0; i < args.length; i++) intakeList.push(args[i].trim());
    let shopDocument: IShopping = await DB.Models.Shopping.findOne({
      guildId: guildid,
    });
    if (!shopDocument) {
      shopDocument = new DB.Models.Shopping({
        guildId: guildid,
        shoppinglist: [],
      });
      await shopDocument.save();
      message.channel.send(
        "You had nothing in your shopping list, but I still scrubbed it clean anyways"
      );
      return;
    }
    let shoppingList = shopDocument.shoppinglist;
    if (shoppingList.length == 0) {
      message.channel.send(
        "You had nothing in your shopping list, but I still scrubbed it clean anyways"
      );
      return;
    }
    for (let i = 0; i < shoppingList.length; i++) {
      const element = shoppingList[i];
      if (!intakeList.includes(element)) returnList.push(element);
    }
    shopDocument.shoppinglist = returnList;
    await shopDocument.updateOne(shopDocument);
    console.log(shopDocument);
    message.channel.send("Removed your items from the shopping list");
  }
}
