import { MessageReaction, User } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { IRoleReactions } from "../../database/models/RoleSchema";
import BaseEvent from "../../utils/structures/BaseEvent";

export default class MessageReactionRemove extends BaseEvent {
  constructor() {
    super("messageReactionRemove");
  }

  async run(client: DiscordClient, reaction: MessageReaction, user: User) {
    const removeMemberRole = async (
      emojiRoleMappings: any,
      reaction: MessageReaction,
      user: User
    ) => {
      if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
        let roleId = emojiRoleMappings[reaction.emoji.id];
        let role = reaction.message.guild.roles.cache.get(roleId);
        let member = reaction.message.guild.members.cache.get(user.id);
        if (role && member) member.roles.remove(role);
      }
    };

    const roleReactionRemove = async (
      client: DiscordClient,
      reaction: MessageReaction,
      user: User,
      id: string
    ) => {
      let rxnDocument: IRoleReactions = await DB.Models.RoleReactions.findOne({
        messageId: id,
      });
      if (rxnDocument) {
        client.cachedMessageReactions.set(id, rxnDocument.emojiRoleMappings);
        let emojiRoleMappings: Map<string, string> =
          rxnDocument.emojiRoleMappings;
        removeMemberRole(emojiRoleMappings, reaction, user);
      }
    };

    if (reaction.message.guild.members.cache.get(user.id).user.bot) return;
    await reaction.message.fetch;
    let id = reaction.message.id;

    await roleReactionRemove(client, reaction, user, id);
  }
}
