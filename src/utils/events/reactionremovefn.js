const MessageModel = require('../../database/models/messageSchema')

let removeMemberRole = (emojiRoleMappings, reaction, user) => {
    if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
        let roleId = emojiRoleMappings[reaction.emoji.id];
        let role = reaction.message.guild.roles.cache.get(roleId);
        let member = reaction.message.guild.members.cache.get(
            user.id,
        );
        if (role && member) {
            member.roles.remove(role);
        }
    }
};

let roleReaction = async (client, reaction, user, id) => {
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
            removeMemberRole(emojiRoleMappings, reaction, user);
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    roleReaction
}