const { helpStatement } = require('../../utils/helpfn')

module.exports = {
    run: async (client, message, args) => {
        // #TODO: Add the music commands to help
        message.delete({ timeout: 5000 });
        let embedMessage;
        let embedTitle;

        let switchValue = args.split(' ')[0];

        
        try {
            let embed = await helpStatement(switchValue);
            await message.channel.send({ embed })
        } catch (err) {
            console.log(err)   
        }
        
    },
    aliases: ['?'],
    description: 'Lists help on all available commands',
};
