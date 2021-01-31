import { DB } from '../../database/database';

export const addMemberRole = (
  emojiRoleMappings: any,
  reaction: any,
  user: any,
) => {
  if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
    let roleId = emojiRoleMappings[reaction.emoji.id];
    let role = reaction.message.guild.roles.cache.get(roleId);
    let member = reaction.message.guild.members.cache.get(user.id);
    if (role && member) {
      member.roles.add(role);
    }
  }
};

export const roleReactionAdd = async (
  client: any,
  reaction: any,
  user: any,
  id: string,
) => {
  try {
    let msgDocument = await DB.Models.RoleReactions.findOne({
      messageId: id,
    });
    if (msgDocument) {
      client.cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
      let { emojiRoleMappings } = msgDocument;
      addMemberRole(emojiRoleMappings, reaction, user);
    }
  } catch (err) {
    console.log(err);
  }
};
