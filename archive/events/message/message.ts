const PREFIX = process.env.PREFIX;
module.exports = (client: any, message: any) => {
  if (message.author.bot) return;
  if (
    message.content.toLowerCase() === 'thank you' ||
    message.content.toLowerCase() === 'thenk you'
  )
    return message.channel.send("You're very welcome ! 🥰");

  if (message.content.toLowerCase() === 'i love you babybot')
    return message.channel.send('ily2 ' + message.author.username);

  if (!message.content.startsWith(PREFIX)) return;
  let cmdName = message.content
    .substring(message.content.indexOf(PREFIX) + 1)
    .split(new RegExp(/\s+/))
    .shift();
  let argsToParse = message.content.substring(message.content.indexOf(' ') + 1);

  if (client.commands.get(cmdName)) {
    client.commands.get(cmdName)(client, message, argsToParse);
  } else {
    try {
      message.channel.send(
        "I don't understand you :(( \ncan you please speak in 1s and 0s?",
      );
    } catch (err) {
      console.log(err);
    }
  }
};
