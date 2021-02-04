import { MessageReaction, User } from "discord.js";
import DiscordClient from "../../client/client";
import { IRoleReactions } from "../../database/models/RoleSchema";

export const roleReactionAdd = async (
  client: DiscordClient,
  reaction: MessageReaction,
  user: User,
  rxnDocument: IRoleReactions
) => {
  if (rxnDocument) {
    const id = reaction.message.id;
    client.cachedMessageReactions.set(id, rxnDocument.emojiRoleMappings);
    let emojiRoleMappings = rxnDocument.emojiRoleMappings;
    if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
      let roleId = emojiRoleMappings[reaction.emoji.id];
      let role = reaction.message.guild.roles.cache.get(roleId);
      let member = reaction.message.guild.members.cache.get(user.id);
      if (role && member) {
        member.roles.add(role);
      }
    }
    return;
  }
};

export const roleReactionRemove = async (
  client: DiscordClient,
  reaction: MessageReaction,
  user: User,
  rxnDocument: IRoleReactions
) => {
  const id = reaction.message.id;
  if (rxnDocument) {
    client.cachedMessageReactions.set(id, rxnDocument.emojiRoleMappings);
    let emojiRoleMappings = rxnDocument.emojiRoleMappings;
    if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
      let roleId = emojiRoleMappings[reaction.emoji.id];
      let role = reaction.message.guild.roles.cache.get(roleId);
      let member = reaction.message.guild.members.cache.get(user.id);
      if (role && member) member.roles.remove(role);
    }
  }
};
