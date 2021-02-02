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
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cron = require('node-cron');
const dbchecksfn_1 = require("./utils/dbchecksfn");
const discord = require('discord.js');
const client = new discord.Client({
    partials: ['MESSAGE', 'REACTION'],
});
const { registerCommands, registerEvents } = require('./utils/events/registry');
cron.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    yield dbchecksfn_1.checkDbEvents(client);
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    client.login(process.env.BOT_TOKEN);
    client.commands = new Map();
    client.queue = new Map();
    client.cachedMessageReactions = new Map();
    yield registerEvents(client, '../../events');
    yield registerCommands(client, '../../commands');
}))();
