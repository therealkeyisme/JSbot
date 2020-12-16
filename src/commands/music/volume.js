module.exports = {
    run: async(client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing.');
        if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
        if(args > 1) {
            return message.channel.send("You cannot set the volume that high. you will die")
        }
        else {
            serverQueue.volume = args; // eslint-disable-line
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args);
            return message.channel.send(`I set the volume to: **${args}**`);
        }
    },
    aliases: [],
    description: "Changes the volume for the music bot"
}