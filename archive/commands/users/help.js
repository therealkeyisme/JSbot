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
const { helpStatement } = require('../../utils/commands/helpfn');
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        // #TODO: Add the music commands to help
        message.delete({ timeout: 5000 });
        let switchValue = args.split(' ')[0];
        try {
            let embed = yield helpStatement(switchValue);
            yield message.channel.send({ embed });
        }
        catch (err) {
            console.log(err);
        }
    }),
    aliases: [],
    description: 'Lists help on all available commands',
};
