module.exports = {
    run: async(client, message, args) => {
        if(!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
            message.channel.send("You don't have permission to use that command.");
        }
        else {
            // let memberId = message.content.substring(message.content.indexOf(' ') + 1);
            // ! This is where you need to borrow code from
            let member = message.guild.members.cache.get(args);
            if(member) {
                if(member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']) && !message.member.hasPermission('ADMINISTRATOR')) {
                    message.channel.send("You cannot mute this member");
                }
                else {
                    let mutedRole = message.guild.roles.cache.get('783967136280084482');
                    if(mutedRole) {
                        member.roles.add(mutedRole);
                        message.channel.send("User was muted");
                    }
                    else {
                        message.channel.send("Muted role not found");
                    }
                }
            }
            else {
                message.channel.send("That member was not found");
            }
        }
    },
    aliases: []
}