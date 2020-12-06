module.exports = {
    run: async(client, message, args) => {
        // TODO: prevent mods from banning other mods like below
        if(!message.member.hasPermission('KICK_MEMBERS')) {
            message.channel.send("You don't have permission to use that command.");
        }
        else {
            let member = message.guild.members.cache.get(args);
            if(member) {
                try {
                    await member.kick();
                    console.log("A member has been kicked.")
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    },
    aliases: []
}