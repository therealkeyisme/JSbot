module.exports = {
  run: async (client, message, args) => {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel
        .send("I'm sorry but you need to be in a voice channel to play music!")
        .catch((err) => {
          throw err;
        });
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
      message.channel.send('There is nothing playing.').catch((err) => {
        throw err;
      });
      return;
    }
    if (args.toLowerCase() === '?volume') {
      message.channel.send(`The current volume is: **${serverQueue.volume}**`);
      return;
    }
    if (args > 10) {
      message.channel.send('You cannot set the volume that high. you will die');
      return;
    } else {
      serverQueue.volume = args; // eslint-disable-line
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args / 10);
      message.channel.send(`I set the volume to: **${args}**`);
      return;
    }
  },
  aliases: [],
  description: 'Changes the volume for the music bot',
};
