const { adminHelpStatement } = require('../../utils/commands/helpfn');

module.exports = {
    run: async (client, message, args) => {
        let GUILDID = message.guild.id;
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send(
                "You don't have permission to use that command.",
            );
        } else {
            let switchValue = args.split(' ')[0];

            try {
                let embed = await adminHelpStatement(switchValue);
                await message.channel.send({ embed });
            } catch (err) {
                console.log(err);
            }
        }
    },
    aliases: ['adminhelp'],
    description: 'Allows for the viewing of admin commands',
};
