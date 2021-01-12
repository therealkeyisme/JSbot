module.exports = {
    run: async (client, message) => {
        const { channel } = message.member.voice;
        if (!channel)
            return message.channel
                .send(
                    "I'm sorry but you need to be in a voice channel to play music!",
                )
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue)
            return message.channel
                .send('There is nothing playing that I could stop for you.')
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
        serverQueue.songs = [];
        serverQueue.connection.dispatcher
            .end('Stop command has been used!')
            .then((message) => message.delete({ timeout: 5000 }))
            .catch((err) => {
                throw err;
            });
    },
    aliases: [],
    description: 'Stops the music',
};
