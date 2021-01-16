const EventModel = require('../../../database/models/eventSchema');
const PrefModel = require('../../../database/models/prefSchema');

module.exports = {
    run: async (client, message, args) => {
        const GUILDID = message.guild.id;
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send(
                "You don't have permission to use this command",
            );
        } else {
            let prefDocument = await PrefModel.findOne({ guildid: GUILDID });
            let newChannel = await message.guild.channels.create(
                'BabyBot Events',
                {
                    type: 'text',
                    topic: 'events',
                },
            );
            console.log();
            if (prefDocument) {
                let newEventChannel = { eventChannel: newChannel.id };
                await prefDocument.updateOne(newEventChannel);
            } else {
                let dbPrefModel = new PrefModel({
                    guildid: GUILDID,
                    eventChannel: newChannel.id,
                });
                await dbPrefModel.save();
            }
        }
    },
    aliases: ['createchannel'],
    description: 'Creates the default channel for events',
};
