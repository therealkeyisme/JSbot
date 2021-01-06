const MessageModel = require('../../database/models/messageSchema');
const { roleReaction } = require('../../utils/events/reactionremovefn');
module.exports = async (client, reaction, user) => {
    if (reaction.message.guild.members.cache.get(user.id).user.bot) {
        return;
    }
    await reaction.message.fetch;
    let { id } = reaction.message;

    await roleReaction(client, reaction, user, id);
};
