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
const { adminHelpStatement } = require('../../utils/commands/helpfn');
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        let GUILDID = message.guild.id;
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send("You don't have permission to use that command.");
        }
        else {
            let switchValue = args.split(' ')[0];
            try {
                let embed = yield adminHelpStatement(switchValue);
                yield message.channel.send({ embed });
            }
            catch (err) {
                console.log(err);
            }
        }
    }),
    aliases: ['adminhelp'],
    description: 'Allows for the viewing of admin commands',
};
