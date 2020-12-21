const ytdl = require('ytdl-core');
const { Util } = require('discord.js');

module.exports = {
    run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) {
            message.channel
                .send("Sorry but you're not in a voice channel :(")
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
            return;
        }

        const serverQueue = message.client.queue.get(
            message.guild.id,
        );
        const songInfo = await ytdl.getInfo(
            args.replace(/<(.+)>/g, '$1'),
        );
        const song = {
            id: songInfo.videoDetails.videoId,
            title: Util.escapeMarkdown(songInfo.videoDetails.title),
            url: songInfo.videoDetails.video_url,
        };

        if (serverQueue) {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            message.channel
                .send(
                    `✅ **${song.title}** has been added to the queue!`,
                )
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
            return;
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 2,
            playing: true,
        };
        message.client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async (song) => {
            const queue = message.client.queue.get(message.guild.id);
            if (!song) {
                queue.voiceChannel.leave();
                message.client.queue.delete(message.guild.id);
                return;
            }
            const dispatcher = queue.connection
                .play(ytdl(song.url))
                .on('finish', () => {
                    queue.songs.shift();
                    play(queue.songs[0]);
                })
                .on('error', (error) => console.error(error));
            dispatcher.setVolumeLogarithmic(queue.volume / 5);
            queue.textChannel.send(
                `🎶 Start playing: **${song.title}**`,
            );
        };

        try {
            queueConstruct.connection = await channel.join();
            await play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(
                `I could not join the voice channel: ${error}`,
            );
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel
                .send(`I could not join the voice channel: ${error}`)
                .then((message) => message.delete({ timeout: 5000 }))
                .catch((err) => {
                    throw err;
                });
        }
    },
    aliases: [],
    description: 'Plays a song in a voice channel',
};
