import { Message, Util, VoiceChannel } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import ytdl from "ytdl-core";
import { QueueType, SongType } from "../../utils/structures/Structures";

/**
 * Creates a command that plays music, or adds music to queue
 *
 * @export Play
 * @class Play
 * @extends {BaseCommand}
 */
export default class Play extends BaseCommand {
  /**
   * Creates an instance of Play.
   * @memberof Play
   */
  constructor() {
    super("play", "music", []);
  }

  /**
   * Function that fetches song from youtube and adds it to queue or plays it
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Play
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const channel: VoiceChannel = message.member.voice.channel;
    const guildid = message.guild.id;
    const argString: string = args.join(" ");
    if (!channel) {
      message.channel.send("Sorry but you're not in a voice channel :(");
      return;
    }

    const serverQueue = client.queue.get(guildid);
    const songInfo = await ytdl.getInfo(argString.replace(/<(.+)>/g, "$1"));
    const song: SongType = {
      id: songInfo.videoDetails.videoId,
      title: Util.escapeMarkdown(songInfo.videoDetails.title),
      url: songInfo.videoDetails.video_url,
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      message.channel.send(`${song.title} has been added to the queue!`);
      return;
    }

    const queueConstruct: QueueType = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 2,
      playing: true,
    };

    client.queue.set(guildid, queueConstruct);
    queueConstruct.songs.push(song);

    /**
     * Plays the first song in the current queue
     *
     * @param {SongType} song Song from the queue
     */
    const play = async (song: SongType) => {
      const queue: QueueType = client.queue.get(guildid);
      if (!song) {
        queue.voiceChannel.leave();
        client.queue.delete(guildid);
        return;
      }
      const dispatcher = queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", (error: string) => console.log(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 10);
      queue.textChannel.send(`Start playing: ${song.title}`);
    };

    try {
      queueConstruct.connection = await channel.join();
      await play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`);
      client.queue.delete(message.guild.id);
      await channel.leave();
      message.channel.send(`I could not join the voice channel: ${error}`);
      return;
    }
  }
}
