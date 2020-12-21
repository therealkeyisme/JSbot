module.exports = {
    run: async (client, message) => {
        const serverQueue = message.client.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send(
                '⏸ Paused the music for you!',
            );
        }
        return message.channel
            .send('theres nothing for me to pause')
            .then((message) => message.delete({ timeout: 5000 }))
            .catch((err) => {
                throw err;
            });
    },
    aliases: [],
    description: 'Pauses the music',
};
