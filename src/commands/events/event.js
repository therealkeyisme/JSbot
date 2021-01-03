// TODO: This all must be linked in with the addrolereaction command possibly split that up into a few files because it will get long
// TODO: Must treat this very similarly to the way the addrole reaction was treated
// TODO: Finish the direct messages here
// TODO: impliment the title, date, and description messages
// TODO: Write the recurring function checkForEvents
// TODO: celebrate because we finished?
// TODO: Fix database problems
const EventModel = require('../../database/models/eventSchema');
const { informationFromUser, findDate, dbAnalysis } = require('../../utils/eventfn')
const Discord = require('discord.js')


module.exports = {
    run: async (client, message) => {
        if(!message.guild) {
            return
        }
        const regExpObj ={
            allWeekDays: /\b((mon|tues|wed(nes)?|thur(s)?|fri|sat(ur)?|sun)(day)?)\b/,
            monday: /\b((mon)(day)?)\b/,
            tuesday: /\b((tues)(day)?)\b/,
            wednesday: /\b((wed(nes)?)(day)?)\b/,
            thursday: /\b((thur(s)?)(day)?)\b/,
            friday: /\b((fri)(day)?)\b/,
            saturday: /\b((sat(ur)?)(day)?)\b/,
            sunday: /\b((sun)(day)?)\b/,
            amOrPm: /\b([0]?[0-9]|1[0-2]):?([0-5]?\d?)([ap])m\b/,
            am: /\b([0]?[0-9]|1[0-2]):?([0-5]?\d?)am\b/,
            pm: /\b([0]?[0-9]|1[0-2]):?([0-5]?\d?)pm\b/,
            date: /\b(\d{4})([\/\-])(0?[1-9]|1[012])\2(0?[1-9]|[12]\d|3[01])\b/,
            time24hr: /\b([01]?[0-9]|2[0-3]):([0-5]\d)\b/,
            tomorrow: /\b(tomorrow)\b/,
            now: /\b(now)\b/
        }

        const GUILDID = message.guild.id;
        // TODO: Make this go away once the dates are done
        const defaultFilter = (m) => m.content.startsWith("")
        const timeDateFiler = (m) => {
            let { allWeekDays, amOrPm, date, time24hr, tomorrow, now } = regExpObj;
            if (allWeekDays.test(m)) return true
            if (amOrPm.test(m)) return true
            if (date) return true
            if (time24hr) return true
            if (tomorrow) return true
            if (now) return true
        }
        let author = message.author
        try {
            let dmChannel = await author.createDM()
            let eventDocument = await EventModel.findOne();
            let embed = {
                title: "Enter the event title",
                description: "Please keep it short",
                color: '#63d6ff'
            };

            let title = await informationFromUser(dmChannel, embed, defaultFilter);

            embed = {
                title: "Enter the event description",
                description: "Type none for no description",
            };
            
            let description = await informationFromUser(dmChannel, embed, defaultFilter);

            // TODO: Add time zone support
            // embed = {
            //     title: "Enter timezone number",
            //     description: "If your time zone is missing use `?request.`"
            // };

            // let timeZone = await informationFromUser(dmChannel, embed);

            embed= {
                title: "When should this event start?",
                description: "```Friday at 9pm\n Tomorrow at 18:00\n Now\n In 1 hour\n YYYY-MM-DD 7:00 PM```"
            }

            let startTime = (await informationFromUser(dmChannel, embed, timeDateFiler)).toLowerCase();

            let event = findDate(startTime, regExpObj)

            console.log(`${event.getFullYear()}-${event.getMonth()}-${event.getDate()} ${event.getHours()}:${event.getMinutes()}`)
            
            let eventMinutes = event.getMinutes()
            let eventMonth = event.getMonth() + 1

            if (eventMinutes === 0) {
                eventMinutes = "00"
            }
            
            
            let returnEmbed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setFooter(`${event.getFullYear()}-${eventMonth}-${event.getDate()} ${event.getHours()}:${eventMinutes}`)
            let eventEmbed = await message.channel.send(returnEmbed)
            await dbAnalysis(eventDocument, GUILDID, title, description, eventEmbed, event)
        }
        catch(err) {
            console.log(err)
        }
    },
    aliases: [],
    description: "This is supposed to create an event"
}
