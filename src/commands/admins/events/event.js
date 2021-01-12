const EventModel = require('../../../database/models/eventSchema');
const {
    informationFromUser,
    findDate,
    dbAnalysis,
} = require('../../../utils/commands/eventfn');
const Discord = require('discord.js');
const PrefModel = require('../../../database/models/prefSchema');

module.exports = {
    run: async (client, message) => {
        if (!message.guild) {
            return;
        }
        if (!message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.send(
                "You don't have permission to use that command.",
            );
        } else {
            const regExpObj = {
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
                now: /\b(now)\b/,
            };

            const GUILDID = message.guild.id;
            // TODO: Make this go away once the dates are done
            const defaultFilter = (m) => m.content.startsWith('');
            const timeDateFiler = (m) => {
                let {
                    allWeekDays,
                    amOrPm,
                    date,
                    time24hr,
                    tomorrow,
                    now,
                } = regExpObj;
                if (allWeekDays.test(m)) return true;
                if (amOrPm.test(m)) return true;
                if (date) return true;
                if (time24hr) return true;
                if (tomorrow) return true;
                if (now) return true;
            };
            let author = message.author;
            try {
                let dmChannel = await author.createDM();
                let eventDocument = await EventModel.findOne();
                let prefDocument = await PrefModel.findOne({
                    guildid: GUILDID,
                });
                let embed = {
                    title: 'Enter the event title',
                    description: 'Please keep it short',
                    color: '#63d6ff',
                };

                let title = await informationFromUser(
                    dmChannel,
                    embed,
                    defaultFilter,
                );

                embed = {
                    title: 'Enter the event description',
                    description: "Please don't make it too",
                    color: '#63d6ff',
                };

                let description = await informationFromUser(
                    dmChannel,
                    embed,
                    defaultFilter,
                );

                // TODO: Add time zone support
                // embed = {
                //     title: "Enter timezone number",
                //     description: "If your time zone is missing use `?request.`"
                // };

                // let timeZone = await informationFromUser(dmChannel, embed);

                embed = {
                    title: 'When should this event start?',
                    description:
                        '```Friday at 9pm\n Tomorrow at 18:00\n Now\n In 1 hour\n YYYY-MM-DD 7:00 PM```',
                    color: '#63d6ff',
                };

                let startTime = (
                    await informationFromUser(dmChannel, embed, timeDateFiler)
                ).toLowerCase();

                let event = findDate(startTime, regExpObj);

                let eventMinutes = event.getMinutes();
                let eventMonth = event.getMonth() + 1;

                if (eventMinutes === 0) {
                    eventMinutes = '00';
                }

                let returnEmbed = new Discord.MessageEmbed()
                    .setTitle(title)
                    .setDescription(description)
                    .addFields(
                        {
                            name: 'Time',
                            value: `${event.getFullYear()}-${eventMonth}-${event.getDate()} ${event.getHours()}:${eventMinutes}`,
                        },
                        { name: '✅Accepted', value: '-', inline: true },
                        { name: '🛑Declined', value: '-', inline: true },
                        { name: '❔Tentative', value: '-', inline: true },
                    )
                    .setColor('#63d6ff');

                let eventEmbed;

                if (prefDocument) {
                    let channelId = prefDocument.eventChannel;
                    let eventChannel = await client.channels.fetch(channelId);
                    eventEmbed = await eventChannel.send(returnEmbed);
                } else {
                    eventEmbed = await message.channel.send(returnEmbed);
                }

                await eventEmbed.react('✅');
                await eventEmbed.react('🛑');
                await eventEmbed.react('❔');

                await dbAnalysis(
                    eventDocument,
                    GUILDID,
                    title,
                    description,
                    eventEmbed,
                    event,
                );
            } catch (err) {
                console.log(err);
            }
        }
    },
    aliases: ['makeevent'],
    description: 'This is supposed to create an event',
};
