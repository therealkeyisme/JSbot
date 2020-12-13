const ytdl = require('ytdl-core');


module.exports = {
    run: async(client, message, args, DEVID, musicUrls) => {
        let guildData = message.guild;

        const connection = await message.member.voice.channel.join()
            .then(connection => {
                if(typeof(connection) !== "object") {

                    for (let i = 0; i < musicUrls.length; i++) {
                        let dispatcher = connection.play(ytdl(musicUrls[0], {filter: "audioonly"}))

                        dispatcher.on('start', () => {

                            message.channel.send(musicUrls[i] + " Has started playing")
                        })
                        musicUrls.shift();
                    }
                    return;
                }
            })







    },
    aliases: [],
    description: "Plays a song in a voice channel"
}