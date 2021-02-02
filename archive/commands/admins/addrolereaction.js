"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MessageCollector } = require('discord.js');
const MessageModel = require('../../database/models/messageSchema');
let msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send("You don't have permission to use that command.");
        }
        else {
            if (args.split(/\s+/).length !== 1) {
                let msg = yield message.channel.send('Too many arguments. Must only provide 1 message id');
                yield msg.delete({ timeout: 2500 }).catch((err) => {
                    console.log(err);
                });
            }
            else {
                try {
                    let fetchedMessage = yield message.channel.messages.fetch(args);
                    if (fetchedMessage) {
                        yield message.channel.send('Please provide all of the emoji names with the role name, one by one, separated with a comma .\ne.g: snapchat, snapchat, where the emoji name comes first and the role name comes second');
                        let collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message));
                        let emojiRoleMappings = new Map();
                        collector.on('collect', (msg) => {
                            let { cache } = msg.guild.emojis;
                            if (msg.content.toLowerCase() === 'done') {
                                collector.stop('Done command was issued');
                                return;
                            }
                            let [emojiName, roleName] = msg.content.split(/,\s+/);
                            if (!emojiName && !roleName)
                                return;
                            let emoji = cache.find((emoji) => emoji.name.toLowerCase() === emojiName.toLowerCase());
                            if (!emoji) {
                                msg.channel
                                    .send('Emoji does not exist. Try again.')
                                    .then((msg) => msg.delete({ timeout: 2000 }))
                                    .catch((err) => console.log(err));
                                return;
                            }
                            let role = msg.guild.roles.cache.find((role) => role.name.toLowerCase() === roleName.toLowerCase());
                            if (!role) {
                                msg.channel
                                    .send('Role does not exist. Try again.')
                                    .then((msg) => msg.delete({ timeout: 2000 }))
                                    .catch((err) => console.log(err));
                                return;
                            }
                            fetchedMessage.react(emoji).catch((err) => console.log(err));
                            emojiRoleMappings.set(emoji.id, role.id);
                        });
                        collector.on('end', (collected, reason) => __awaiter(void 0, void 0, void 0, function* () {
                            let findMsgDocument = yield MessageModel.findOne({
                                messageId: fetchedMessage.id,
                            }).catch((err) => console.log(err));
                            if (findMsgDocument) {
                                try {
                                    yield message.channel.send('There is already a role reaction for that message');
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                            else {
                                let dbMsgModel = new MessageModel({
                                    messageId: fetchedMessage.id,
                                    emojiRoleMappings: emojiRoleMappings,
                                });
                                dbMsgModel
                                    .save()
                                    .then((m) => console.log(m))
                                    .catch((err) => console.log(err));
                            }
                        }));
                    }
                }
                catch (err) {
                    console.log(err);
                    let msg = yield message.channel.send('Invalid ID. Message was not found.');
                    yield msg
                        .delete({ timeout: 3500 })
                        .catch((err) => console.log(err));
                }
            }
        }
    }),
    aliases: [],
    description: 'Creates message for giving roles',
};
