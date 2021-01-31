module.exports = {
  run: async (client: any, message: any, args: any) => {
    // TODO: prevent mods from banning other mods like below
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      message.channel.send("You don't have permission to use that command.");
    } else {
      try {
        let member = await message.guild.members.kick(args);
        if (member) {
          await message.channel.send('A user has been kicked');
        } else {
          await message.channel.send('I could not find that user');
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  aliases: [],
  description: 'Kicks a user',
};
