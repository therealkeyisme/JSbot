const EventModel = require('../../../database/models/eventSchema');
const {
  informationFromUser,
  findDate,
  dbAnalysis,
} = require('../../../utils/commands/eventfn');
const Discord = require('discord.js');
const PrefModel = require('../../../database/models/prefSchema');
const { regExpObj } = require('../../../utils/regExpObj');

module.exports = {
  run: async (client, message) => {
    if (!message.guild) {
      return;
    }
    if (!message.member.hasPermission(['ADMINISTRATOR'])) {
      return message.channel.send(
        "You don't have permission to use that command.",
      );
    }
    const GUILDID = message.guild.id;
    // TODO: Make this go away once the dates are done
    const defaultFilter = (m) => m.content.startsWith('');
    const timeDateFiler = (m) => {
      let { allWeekDays, amOrPm, date, time24hr, tomorrow, now } = regExpObj;
      if (allWeekDays.test(m)) return true;
      if (amOrPm.test(m)) return true;
      if (date.test(m)) return true;
      if (time24hr.test(m)) return true;
      if (tomorrow.test(m)) return true;
      if (now.test(m)) return true;
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

      let title = await informationFromUser(dmChannel, embed, defaultFilter);

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
          '```Friday at 9pm\n Tomorrow at 18:00\n Now\n DD-MM-YYYY 7:00 PM```',
        color: '#63d6ff',
      };

      let startTime = (
        await informationFromUser(dmChannel, embed, timeDateFiler)
      ).toLowerCase();

      let event = findDate(startTime);

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
  },
  aliases: ['makeevent'],
  description: 'This is supposed to create an event',
};
