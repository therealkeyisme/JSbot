const PrefModel = require('../../../database/models/prefSchema');

module.exports = {
    run: async (client, message, args) => {
        const GUILDID = message.guild.id;
        const calledChannelId = message.channel.id;
        let prefDocument = await PrefModel.findOne({ guildid: GUILDID });
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send(
                "You don't have permission to use that command.",
            );
        } else {
            if (prefDocument) {
                let newEventChannel = { eventChannel: calledChannelId };
                await prefDocument.updateOne(newEventChannel);
            } else {
                let dbPrefModel = new PrefModel({
                    guildid: GUILDID,
                    eventChannel: calledChannelId,
                });
                await dbPrefModel.save();
            }
        }
    },
    aliases: ['defaulteventchannel'],
    description: 'Sets the default event channel',
};