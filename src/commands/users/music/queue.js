module.exports = {
    run: async (client, message) => {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue)
            return message.channel.send(
                'theres nothing in the queue'
                    .then((message) => message.delete({ timeout: 5000 }))
                    .catch((err) => {
                        throw err;
                    }),
            );
        return message.channel
            .send(
                `
__**Song queue:**__

${serverQueue.songs.map((song) => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
		`,
            )
            .then((message) => message.delete({ timeout: 5000 }))
            .catch((err) => {
                throw err;
            });
    },
    aliases: [],
    description: 'Shows the current queue',
};
