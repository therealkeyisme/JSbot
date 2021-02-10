import { Guild, Message } from "discord.js";
import DiscordClient from "../client/client";
import { DB } from "../database/database";
import BaseEvent from "../utils/structures/BaseEvent";

export default class GuildJoin extends BaseEvent {
  constructor() {
    super("guildCreate");
  }

  async run(client: DiscordClient, guild: Guild) {
    const guildid = guild.id;
    let prefDocument = new DB.Models.Preferences({
      guildid: guildid,
    });
    prefDocument.save();
    return;
  }
}
