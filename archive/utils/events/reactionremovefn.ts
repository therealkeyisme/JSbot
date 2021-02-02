import { DB } from '../../database/database';

export const removeMemberRole = (
  emojiRoleMappings: any,
  reaction: any,
  user: any,
) => {
  if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
    let roleId = emojiRoleMappings[reaction.emoji.id];
    let role = reaction.message.guild.roles.cache.get(roleId);
    let member = reaction.message.guild.members.cache.get(user.id);
    if (role && member) {
      member.roles.remove(role);
    }
  }
};

export const roleReactionRemove = async (
  client: any,
  reaction: any,
  user: any,
  id: any,
) => {
  try {
    let msgDocument = await DB.Models.RoleReactions.findOne({
      messageId: id,
    });
    if (msgDocument) {
      client.cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
      let { emojiRoleMappings } = msgDocument;
      removeMemberRole(emojiRoleMappings, reaction, user);
    }
  } catch (err) {
    console.log(err);
  }
};
