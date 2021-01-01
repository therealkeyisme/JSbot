const { Collector } = require('discord.js');
const EventModel = require('../../database/models/eventSchema');
// let dbEventModel = new EventModel({
//     guildId: GUILDID,
//     events: [
//         {
//             title: eventTitle,
//             date: Date.now()
//         }
//     ]
// });
// dbEventModel.save()

// TODO: This all must be linked in with the addrolereaction command possibly split that up into a few files because it will get long
// TODO: Must treat this very similarly to the way the addrole reaction was treated
// TODO: Finish the direct messages here
// TODO: impliment the title, date, and description messages
// TODO: celebrate because we finished?
module.exports = {
    run: async (client, message, args) => {
        const filter = (m) => m.content.startsWith("")
        const GUILDID = message.guild.id;
        // await message.author.send("hi")
        let author = message.author
        // console.log(author)
        let dmchannel = await author.createDM(true)
        let eventDocument = await EventModel.findOne({
            guildId: GUILDID
        })
        console.log(eventDocument)
        // await dmchannel.send("hi")

        // // let collector = dmchannel.createMessageCollector(filter)

        // // collector.on('collect', (n) => {
        // //     console.log(n.content)
        // // })
    },
    aliases: [],
    description: "This is supposed to create an event"
}
