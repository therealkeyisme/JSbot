module.exports = {
    run: async (client, message, args) => {
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
        const serverQueue = message.client.queue.get(
            message.guild.id,
        );
        if (!serverQueue) {
            message.channel
                .send('There is nothing playing.')
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
            return;
        }
        if (args.toLowerCase() === '?volume') {
            message.channel
                .send(
                    `The current volume is: **${serverQueue.volume}**`,
                )
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
            return;
        }
        if (args > 1) {
            message.channel
                .send(
                    'You cannot set the volume that high. you will die',
                )
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
            return;
        } else {
            serverQueue.volume = args; // eslint-disable-line
            serverQueue.connection.dispatcher.setVolumeLogarithmic(
                args,
            );
            message.channel
                .send(`I set the volume to: **${args}**`)
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
            return;
        }
    },
    aliases: [],
    description: 'Changes the volume for the music bot',
};
