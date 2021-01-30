module.exports = {
    run: async (client, message, args) => {
        message.delete({ timeout: 1000 });
        return message.channel
            .send("This is broken don't use this command")
            .then((message) => message.delete({ timeout: 3000 }))
            .catch((err) => {
                throw err;
            });
        let { cache } = message.guild.roles;
        let mutedRole = cache.find(
            (role) => role.name.toLowerCase() === 'muted',
        );
        if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
            message.channel.send(
                "You don't have permission to use that command.",
            );
        } else {
            // let memberId = message.content.substring(message.content.indexOf(' ') + 1);
            // ! This is where you need to borrow code from
            let member = message.guild.members.cache.get(args);
            if (member) {
                if (
                    member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']) &&
                    !message.member.hasPermission('ADMINISTRATOR')
                ) {
                    message.channel.send('You cannot mute this member');
                } else {
                    if (mutedRole) {
                        member.roles.add(mutedRole);
                        message.channel.send('User was muted');
                    } else {
                        message.channel.send('Muted role not found');
                    }
                }
            } else {
                message.channel.send('That member was not found');
            }
        }
    },
    aliases: [],
    description: 'Mutes a user',
};