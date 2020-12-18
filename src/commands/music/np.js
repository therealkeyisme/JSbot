module.exports = {
    run: async(client, message) => {
        const serverQueue = message.client.queue.get(message.guild.id);
        if(!serverQueue) { 
            message.channel.send('there is nothing playing');
            return;
        }
        message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`.then(message => message.delete({timeout:5000})).catch(err => {throw err}));
        return 
    },
    aliases: ["nowplaying"],
    description: "Shows what is currently playing"
}