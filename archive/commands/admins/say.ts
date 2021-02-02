module.exports = {
  run: async (client: any, message: any, args: any) => {
    if (args === '!say') {
      return;
    }
    if (!message.member.hasPermission(['ADMINISTRATOR'])) {
      message.channel.send("You don't have permission to use that command.");
    } else {
      let returnMessage = args;

      return await message.channel.send(args);
    }
  },
  aliases: [],
  description: 'Has the bot say something in the chat',
};
