module.exports = {
    run: async(client, message) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!').then(message => message.delete({timeout:5000})).catch(err => {throw err});
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.').then(message => message.delete({timeout:5000})).catch(err => {throw err});
        serverQueue.connection.dispatcher.end('Skip command has been used!').then(message => message.delete({timeout:5000})).catch(err => {throw err});
    },
    aliases: ["next"],
    description: "Skips the current song"
}