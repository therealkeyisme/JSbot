module.exports = {
    run: async (client, message, args) => {
        if (args === '!say') {
            return;
        }

        let returnMessage = args;

        return await message.channel.send(args);
    },
    aliases: [],
    description: 'Has the bot say something in the chat',
};
