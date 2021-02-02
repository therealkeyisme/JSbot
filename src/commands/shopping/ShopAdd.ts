import { Message } from "discord.js";
import { stringify } from "querystring";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import BaseCommand from "../../utils/structures/BaseCommand";
import { ShopObject } from "../../utils/structures/Structures";
import { IShopping } from "../../database/models/ShoppingSchema";
import { Model } from "mongoose";

export default class ShopAdd extends BaseCommand {
  constructor() {
    super("shopadd", "shopping", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildid = message.guild.id;
    let argString = args.join(" ");
    let intakeList = argString.split(", ");

    let shopDocument: IShopping = await DB.Models.Shopping.findOne({
      guildId: guildid,
    });
    if (!shopDocument) {
      shopDocument = new DB.Models.Shopping({
        guildId: guildid,
        shoppingList: intakeList,
      });
    }

    console.log(intakeList);
  }
}
