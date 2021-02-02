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
require('dotenv').config();
const DEVID = process.env.BOT_OWNER;
module.exports = {
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        let returnMessage = 'We have informed someone of your request. If you are reporting a bug, please see https://github.com/therealkeyisme/JSbot/issues and start a new issue.';
        let devMessage = 'Req/Iss:  ```' + args + '```';
        let devUser = client.users.fetch(DEVID).then((value) => {
            value.send(devMessage);
        });
        message.channel.send(returnMessage);
    }),
    aliases: ['report', 'issue'],
    description: 'Makes a request for a feature or reports a bug',
};
