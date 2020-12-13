module.exports = {
    run: async(client, message) => {
        const serverQueue = message.client.queue.get(message.guild.id);
        if(!serverQueue) return message.channel.send('there is nothing playing')
        return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`)
    },
    aliases: ["nowplaying"],
    description: "Shows what is currently playing"
}