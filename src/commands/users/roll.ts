import { flipCoin } from '../../utils/commands/flipfn';

module.exports = {
  run: async (client: any, message: any) => {
    message.reply('rolled a ' + flipCoin());
  },
  aliases: ['coinflip', 'flipcoin'],
  description: 'Rolls a dice',
};
