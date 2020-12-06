module.exports = {
    run: async(client, message, args) => {
        // TODO: prevent mods from banning other mods like below
        if(!message.member.hasPermission('BAN_MEMBERS')) {
            message.channel.send("You don't have permission to use that command.");
        }
        else {
            try {
                let bannedMember = await message.guild.members.ban(args);
                if(bannedMember) {
                    console.log(bannedMember.tag + " was banned");
                }
                else{
                    console.log("Ban was attempted but failed");
                }
            }
            catch(err) {
                console.log(err);
            }
        }
    },
    aliases: []
}