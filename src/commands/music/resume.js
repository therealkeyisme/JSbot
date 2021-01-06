module.exports = {
    run: async (client, message) => {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send(
                '▶ Resumed the music for you!'
                    .then((message) => message.delete({ timeout: 5000 }))
                    .catch((err) => {
                        throw err;
                    }),
            );
        }
        return message.channel
            .send('There is nothing playing.')
            .then((message) => message.delete({ timeout: 5000 }))
            .catch((err) => {
                throw err;
            });
    },
    aliases: [],
    description: 'Resumes the music',
};
