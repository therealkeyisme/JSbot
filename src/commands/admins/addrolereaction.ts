const { MessageCollector } = require('discord.js');
const MessageModel = require('../../database/models/messageSchema');

let msgCollectorFilter = (newMsg: any, originalMsg: any) =>
  newMsg.author.id === originalMsg.author.id;
module.exports = {
  run: async (client: any, message: any, args: any) => {
    if (!message.member.hasPermission(['ADMINISTRATOR'])) {
      message.channel.send("You don't have permission to use that command.");
    } else {
      if (args.split(/\s+/).length !== 1) {
        let msg = await message.channel.send(
          'Too many arguments. Must only provide 1 message id',
        );
        await msg.delete({ timeout: 2500 }).catch((err: any) => {
          console.log(err);
        });
      } else {
        try {
          let fetchedMessage = await message.channel.messages.fetch(args);
          if (fetchedMessage) {
            await message.channel.send(
              'Please provide all of the emoji names with the role name, one by one, separated with a comma .\ne.g: snapchat, snapchat, where the emoji name comes first and the role name comes second',
            );
            let collector = new MessageCollector(
              message.channel,
              msgCollectorFilter.bind(null, message),
            );
            let emojiRoleMappings = new Map();
            collector.on('collect', (msg: any) => {
              let { cache } = msg.guild.emojis;
              if (msg.content.toLowerCase() === 'done') {
                collector.stop('Done command was issued');
                return;
              }
              let [emojiName, roleName] = msg.content.split(/,\s+/);
              if (!emojiName && !roleName) return;
              let emoji = cache.find(
                (emoji: any) =>
                  emoji.name.toLowerCase() === emojiName.toLowerCase(),
              );
              if (!emoji) {
                msg.channel
                  .send('Emoji does not exist. Try again.')
                  .then((msg: any) => msg.delete({ timeout: 2000 }))
                  .catch((err: any) => console.log(err));
                return;
              }
              let role = msg.guild.roles.cache.find(
                (role: any) =>
                  role.name.toLowerCase() === roleName.toLowerCase(),
              );
              if (!role) {
                msg.channel
                  .send('Role does not exist. Try again.')
                  .then((msg: any) => msg.delete({ timeout: 2000 }))
                  .catch((err: any) => console.log(err));
                return;
              }
              fetchedMessage.react(emoji).catch((err: any) => console.log(err));
              emojiRoleMappings.set(emoji.id, role.id);
            });
            collector.on('end', async (collected: any, reason: any) => {
              let findMsgDocument = await MessageModel.findOne({
                messageId: fetchedMessage.id,
              }).catch((err: any) => console.log(err));
              if (findMsgDocument) {
                try {
                  await message.channel.send(
                    'There is already a role reaction for that message',
                  );
                } catch (err) {
                  console.log(err);
                }
              } else {
                let dbMsgModel = new MessageModel({
                  messageId: fetchedMessage.id,
                  emojiRoleMappings: emojiRoleMappings,
                });
                dbMsgModel
                  .save()
                  .then((m: any) => console.log(m))
                  .catch((err: any) => console.log(err));
              }
            });
          }
        } catch (err) {
          console.log(err);
          let msg = await message.channel.send(
            'Invalid ID. Message was not found.',
          );
          await msg
            .delete({ timeout: 3500 })
            .catch((err: any) => console.log(err));
        }
      }
    }
  },
  aliases: [],
  description: 'Creates message for giving roles',
};
