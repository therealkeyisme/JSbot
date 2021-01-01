// TODO: This all must be linked in with the addrolereaction command possibly split that up into a few files because it will get long
// TODO: Must treat this very similarly to the way the addrole reaction was treated
// TODO: Finish the direct messages here
// TODO: impliment the title, date, and description messages
// TODO: celebrate because we finished?
// TODO: Write the recurring function checkForEvents
// TODO: Figure out how to interpret time
const EventModel = require('../../database/models/eventSchema');

let informationFromUser  = async (dmChannel, embed) => {
    const filter = (m) => m.content.startsWith("")
    await dmChannel.send({ embed })
    let collected = await dmChannel.awaitMessages(filter, { max: 1, time: 30000})
    let information = collected.first().content
    return information
}

module.exports = {
    run: async (client, message, args) => {
        
        const GUILDID = message.guild.id;
        // await message.author.send("hi")
        let author = message.author
        // console.log(author)
        try {
            let dmChannel = await author.createDM(true)
            let eventDocument = await EventModel.findOne({
                guildId: GUILDID
            });
            if(!eventDocument) {

            };
            let embed = {
                title: "Enter the event title",
                description: "Please keep it short",
                color: '#63d6ff'
            };

            let title = await informationFromUser(dmChannel, embed);

            embed = {
                title: "Enter the event description",
                description: "Type none for no description",
            };
            
            let description = await informationFromUser(dmChannel, embed);

            embed = {
                title: "Enter timezone number",
                description: "If your time zone is missing use `?request.`"
            };

            let timeZone = await informationFromUser(dmChannel, embed);

            embed= {
                title: "When should this event start?",
                description: "```Friday at 9pm\n Tomorrow at 18:00\n Now\n In 1 hour\n YYYY-MM-DD 7:00 PM```"
            }

            let startTime = await informationFromUser(dmChannel, embed);

            console.log(title, description, timeZone, startTime)
            // await dmChannel.send({ embed })
        } catch(err) {
            console.log(err)
        }
        

        
    },
    aliases: [],
    description: "This is supposed to create an event"
}
