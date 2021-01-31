import { roleReactionRemove } from '../../utils/events/reactionremovefn';
module.exports = async (client: any, reaction: any, user: any) => {
  if (reaction.message.guild.members.cache.get(user.id).user.bot) {
    return;
  }
  await reaction.message.fetch;
  let { id } = reaction.message;

  await roleReactionRemove(client, reaction, user, id);
};
