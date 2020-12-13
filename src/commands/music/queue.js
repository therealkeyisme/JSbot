const fs = require('fs');
const ytdl = require('ytdl-core')

module.exports = {
    run: async(client, message, args, DEVID, musicUrls) => {
        let url = args
        const streamOptions = {
            seek: 0,
            volume: 2
        }
        if(ytdl.validateURL(url)){
            console.log("validated")
            if(!musicUrls.some(element => {
                element === url;
            })) {
                musicUrls.push(url);
                message.channel.send("Successfully added to the queue")
            }
        }
    },
    aliases: [],
    description: ""
}