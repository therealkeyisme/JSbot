import { MessageReaction, User } from "discord.js";
import DiscordClient from "../../client/client";
import { IRoleReactions } from "../../database/models/RoleSchema";

/**
 * Adds role to a user if they react to a role reaction message.
 *
 * @param {DiscordClient} client The discord client class / extension of that class
 * @param {MessageReaction} reaction The reaction made by the user.
 * @param {User} user The user who made the reaction
 * @param {IRoleReactions} rxnDocument A docunent from the database with role reactions
 */
export const roleReactionAdd = async (
  client: DiscordClient,
  reaction: MessageReaction,
  user: User,
  rxnDocument: IRoleReactions
): Promise<void> => {
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

/**
 * Removes a role form user if they react to a role reaction message
 *
 * @param {DiscordClient} client The discord client class / extension of that class.
 * @param {MessageReaction} reaction The reaction made by the user.
 * @param {User} user The user who made the reaction.
 * @param {IRoleReactions} rxnDocument A docunent from the database with role reactions.
 */
export const roleReactionRemove = async (
  client: DiscordClient,
  reaction: MessageReaction,
  user: User,
  rxnDocument: IRoleReactions
): Promise<void> => {
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
