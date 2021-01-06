const EventModel = require('../database/models/eventSchema');
const Discord = require('discord.js');

const checkDbEvents = async (client) => {
    try {
        let eventDocument = await EventModel.findOne();
        let { events } = eventDocument;
        let newEventList = [];
        let currentDate = new Date();
        const today = new Date(Date.now());

        for (let i = 0; i < events.length; i++) {
            currentEvent = events[i];
            let { accepted } = currentEvent;
            if (accepted.length > 0) {
                let { date } = currentEvent;
                let { guildid } = currentEvent;
                let guildObj = await client.guilds.fetch(guildid);
                let guildTitle = guildObj.name;
                datenowdifference = date - today;

                if (datenowdifference <= 1800000 && accepted.length > 0) {
                    for (let j = 0; j < accepted.length; j++) {
                        let user = await client.users.fetch(accepted[j].userid);
                        let notified = accepted[j].notified;
                        if (!notified || notified === false) {
                            let dmChannel = await user.createDM();
                            let returnEmbed = new Discord.MessageEmbed()
                                .setTitle(
                                    'Reminder: Event starting in less than 30 minutes',
                                )
                                .setDescription(
                                    `${currentEvent.title} in ${guildTitle} is starting in just under 30 minutes.`,
                                )
                                .setColor('#63d6ff');
                            await dmChannel.send(returnEmbed);
                            currentEvent.accepted[j].notified = true;
                            // accepted[j].notified = true
                        }
                    }
                }
            }
            newEventList.push(currentEvent);
        }

        let updatedEventObject = { events: newEventList };
        await eventDocument.updateOne(updatedEventObject);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    checkDbEvents,
};
