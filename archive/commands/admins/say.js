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
        if (args === '!say') {
            return;
        }
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send("You don't have permission to use that command.");
        }
        else {
            let returnMessage = args;
            return yield message.channel.send(args);
        }
    }),
    aliases: [],
    description: 'Has the bot say something in the chat',
};
