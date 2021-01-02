// TODO: This all must be linked in with the addrolereaction command possibly split that up into a few files because it will get long
// TODO: Must treat this very similarly to the way the addrole reaction was treated
// TODO: Finish the direct messages here
// TODO: impliment the title, date, and description messages
// TODO: Write the recurring function checkForEvents
// TODO: Figure out how to interpret time
// TODO: celebrate because we finished?
const EventModel = require('../../database/models/eventSchema');
const { checkDbEvents, informationFromUser, findDate } = require('../../utils/eventfn')


module.exports = {
    run: async (client, message, args) => {
        if(!message.guild) {
            return
        }
        const GUILDID = message.guild.id;
        // TODO: Make this go away once the dates are done
        const filter = (m) => m.content.startsWith("")
        let author = message.author
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

            // let title = await informationFromUser(dmChannel, embed);

            // embed = {
            //     title: "Enter the event description",
            //     description: "Type none for no description",
            // };
            
            // let description = await informationFromUser(dmChannel, embed);

            // embed = {
            //     title: "Enter timezone number",
            //     description: "If your time zone is missing use `?request.`"
            // };

            // let timeZone = await informationFromUser(dmChannel, embed);

            embed= {
                title: "When should this event start?",
                description: "```Friday at 9pm\n Tomorrow at 18:00\n Now\n In 1 hour\n YYYY-MM-DD 7:00 PM```"
            }

            let startTime = (await informationFromUser(dmChannel, embed, filter)).toLowerCase();

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
            const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const today = new Date(Date.now())
            const todayDay = today.getDay() + 1 // Day number
            const todayDate = today.getDate() // Date number
            const todayMonth = today.getMonth()
            const todayYear = today.getFullYear()
            const todayHours = today.getHours()
            const todayMinutes = today.getMinutes()
            let event = today;
            let eventDay = todayDay;
            let eventDate = todayDate;
            let eventMonth = todayMonth;
            let eventYear = todayYear;
            let eventHours = todayHours;
            let eventMinutes = todayMinutes;
            let weekDayNumber;
            // Testing to see if a day of the week is chosen
            if (regExpObj.allWeekDays.test(startTime)) {
                eventDay = (regExpObj.allWeekDays.exec(startTime))[1]
                for (let i=0; i < weekdays.length; i++) {
                    if (weekdays[i] === eventDay)
                        weekDayNumber = i + 1
                }
                if (weekDayNumber < todayDay || weekDayNumber === todayDay) {
                    weekDayNumber += 7;
                }
                eventDate = (weekDayNumber - todayDay) + todayDate;
            }
            else if (regExpObj.date.test(startTime)) {
                eventYear = regExpObj.date.exec(startTime)[1]
                eventMonth = parseInt(regExpObj.date.exec(startTime)[3]) - 1
                eventDate = regExpObj.date.exec(startTime)[4]
            }
            else if(regExpObj.tomorrow.test(startTime)) {
                eventDate = todayDate + 1;
            }
            // Testing to see if its am or pm... then if it is then which one
            if (regExpObj.amOrPm.test(startTime)) {
                eventHours = parseInt(regExpObj.amOrPm.exec(startTime)[1])
                eventMinutes = parseInt(regExpObj.amOrPm.exec(startTime)[2])
                if (regExpObj.pm.test(startTime)) {
                    eventHours += 12;
                }
                if (!eventMinutes) {
                    eventMinutes = 0
                }
            }
            else if (regExpObj.time24hr.test(startTime)) {
                eventHours = regExpObj.time24hr.exec(startTime)[1]
                eventMinutes = regExpObj.time24hr.exec(startTime)[2]
            }

            event.setFullYear(eventYear);
            event.setMonth(eventMonth);
            event.setDate(eventDate);
            event.setHours(eventHours);
            event.setMinutes(eventMinutes)
            event.setSeconds(0);
            event.setMilliseconds(0);

            console.log(`${event.getFullYear()}-${event.getMonth()}-${event.getDate()} ${event.getHours()}:${event.getMinutes()}`)
        }
        catch(err) {
            console.log(err)
        }
    },
    aliases: [],
    description: "This is supposed to create an event"
}
