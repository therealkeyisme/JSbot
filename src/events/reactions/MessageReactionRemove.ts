import { MessageReaction, User } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { IRoleReactions } from "../../database/models/RoleSchema";
import { roleReactionRemove } from "../../utils/events/RoleReactionHelperfn";
import BaseEvent from "../../utils/structures/BaseEvent";

export default class MessageReactionRemove extends BaseEvent {
  constructor() {
    super("messageReactionRemove");
  }

  async run(client: DiscordClient, reaction: MessageReaction, user: User) {
    if (reaction.message.guild.members.cache.get(user.id).user.bot) return;
    // await reaction.message.fetch();
    let rxnDocument: IRoleReactions = await DB.Models.RoleReactions.findOne({
      messageId: reaction.message.id,
    });
    await roleReactionRemove(client, reaction, user, rxnDocument);
  }
}
