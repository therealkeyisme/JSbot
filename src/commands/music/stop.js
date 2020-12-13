module.exports = {
    run: async(client, message, args, DEVID, musicUrls) => {
        message.member.voice.channel.leave()
        for(let i = 0; i < musicUrls.length; i++) {
            musicUrls = musicUrls
        }
    },
    aliases: [],
    description: ""
}