import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { IShopping } from "../../database/models/ShoppingSchema";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class ShopClear extends BaseCommand {
  constructor() {
    super("shopclear", "shopping", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    const returnMessage =
      "Say goodbye to your shopping list, it won't be coming back";
    let shopDocument: IShopping = await DB.Models.Shopping.findOne({
      guildId: guildid,
    });
    if (!shopDocument) {
      shopDocument = new DB.Models.Shopping({
        guildId: guildid,
        shoppinglist: [],
      });
      shopDocument.save();
      message.channel.send(returnMessage);
      return;
    }
    shopDocument.shoppinglist = [];
    shopDocument.updateOne();
    message.channel.send(returnMessage);
  }
}
