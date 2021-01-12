require('dotenv').config();
const DEVID = process.env.BOT_OWNER;

module.exports = {
    run: async (client, message, args) => {
        let returnMessage =
            'We have informed someone of your request. If you are reporting a bug, please see https://github.com/therealkeyisme/JSbot/issues and start a new issue.';
        let devMessage = 'Req/Iss:  ```' + args + '```';
        let devUser = client.users.fetch(DEVID).then((value) => {
            value.send(devMessage);
        });
        message.channel.send(returnMessage);
    },
    aliases: ['report', 'issue'],
    description: 'Makes a request for a feature or reports a bug',
};
