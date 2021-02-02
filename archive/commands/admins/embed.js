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
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (args.toLowerCase() === '?embed') {
            return message.channel.send('You need to make sure you give me some arguments so I know where everything goes.');
        }
        else if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send("You don't have permissions to use this command");
        }
        else {
            args = args.split(', ');
            let { cache } = message.guild.roles;
            let embedChannel = client.channels.cache.get(args[0].substring(8));
            let embedTitle = args[1].substring(6);
            let embedDescription = args[2].substring(12);
            let embedAuthor = message.author.username;
            let embedThumbnail;
            if (args[3] === undefined) {
                embedThumbnail = message.author.displayAvatarURL();
            }
            else {
                embedThumbnail = args[3].substring(10);
            }
            embedThumbnail = {
                url: embedThumbnail,
                height: 25,
                width: 25,
            };
            let embedTimestamp = new Date();
            let embed = {
                title: embedTitle,
                description: embedDescription,
                thumbnail: embedThumbnail,
                timestamp: embedTimestamp,
                author: embedAuthor,
            };
            embedChannel.send({ embed });
            return message.delete({ timeout: 15000 });
        }
    }),
    aliases: [],
    description: 'Creates an embed',
};
