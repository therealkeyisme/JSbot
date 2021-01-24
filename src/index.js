require('dotenv').config();
const cron = require('node-cron');
const { checkDbEvents } = require('./utils/dbchecksfn');
const discord = require('discord.js');
const client = new discord.Client({
  partials: ['MESSAGE', 'REACTION'],
});
const { registerCommands, registerEvents } = require('./utils/events/registry');

cron.schedule('* * * * *', async () => {
  await checkDbEvents(client);
});

(async () => {
  client.login(process.env.BOT_TOKEN);
  client.commands = new Map();
  client.queue = new Map();
  client.cachedMessageReactions = new Map();
  await registerEvents(client, '../../events');
  await registerCommands(client, '../../commands');
})();
