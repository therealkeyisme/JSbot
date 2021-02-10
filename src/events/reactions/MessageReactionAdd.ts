import { MessageReaction, User } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { IEvents } from "../../database/models/EventSchema";
import { IRoleReactions } from "../../database/models/RoleSchema";
import { eventReaction } from "../../utils/events/EventReactionHelperFn";
import { roleReactionAdd } from "../../utils/events/RoleReactionHelperfn";
import BaseEvent from "../../utils/structures/BaseEvent";

export default class MessageReactionAdd extends BaseEvent {
  constructor() {
    super("messageReactionAdd");
  }

  async run(client: DiscordClient, reaction: MessageReaction, user: User) {
    if (reaction.message.guild.members.cache.get(user.id).user.bot) return;
    let id = reaction.message.id;
    let rxnDocument: IRoleReactions = await DB.Models.RoleReactions.findOne({
      messageId: id,
    });
    await roleReactionAdd(client, reaction, user, rxnDocument);

    let eventDocument: IEvents = await DB.Models.Events.findOne({
      messageid: id,
    });

    await eventReaction(reaction, user, eventDocument);
  }
}
