const MessageModel = require('../../database/models/messageSchema');
module.exports = async (client, reaction, user) => {
    if (reaction.message.guild.members.cache.get(user.id).user.bot) {
        return;
    }
    
    let addMemberRole = (emojiRoleMappings) => {
        if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
            let roleId = emojiRoleMappings[reaction.emoji.id];
            let role = reaction.message.guild.roles.cache.get(roleId);
            let member = reaction.message.guild.members.cache.get(
                user.id,
            );
            if (role && member) {
                member.roles.add(role);
            }
        }
    };
    await reaction.message.fetch();
    let { id } = reaction.message;
    try {
        let msgDocument = await MessageModel.findOne({
            messageId: id,
        });
        if (msgDocument) {
            client.cachedMessageReactions.set(
                id,
                msgDocument.emojiRoleMappings,
            );
            let { emojiRoleMappings } = msgDocument;
            addMemberRole(emojiRoleMappings);
        }
    } catch (err) {
        console.log(err);
    }
};
