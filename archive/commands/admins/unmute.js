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
        message.delete({ timeout: 1000 });
        return message.channel
            .send("This is broken don't use this command")
            .then((msg) => msg.delete({ timeout: 3000 }))
            .catch((err) => {
            throw err;
        });
        if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
            message.channel.send("You don't have permission to use that command.");
        }
        else {
            // let memberId = message.content.substring(message.content.indexOf(' ') + 1);
            // ! This is where you need to borrow code from
            let member = message.guild.members.cache.get(args);
            if (member) {
                if (member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']) &&
                    !message.member.hasPermission('ADMINISTRATOR')) {
                    message.channel.send('You cannot unmute this member');
                }
                else {
                    let mutedRole = message.guild.roles.cache.get('783967136280084482');
                    if (mutedRole) {
                        member.roles.remove(mutedRole);
                        message.channel.send('User was unmuted');
                    }
                    else {
                        message.channel.send('Muted role not found');
                    }
                }
            }
            else {
                message.channel.send('That member was not found');
            }
        }
    }),
    aliases: [],
    description: 'Unmutes a user',
};
