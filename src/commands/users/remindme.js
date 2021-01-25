const { regExpObj, isThisValid } = require('../../utils/regExpObj');
const RemindModel = require('../../database/models/remindSchema');
const { findDate } = require('../../utils/commands/eventfn');

module.exports = {
  run: async (client, message, args) => {
    if (args == '?remindme') {
      return message.channel.send(
        "I cannot remind you if you don't tell me when to do so",
      );
    }
    try {
      const GUILDID = message.guild.id;
      const CHANNELID = message.channel.id;
      const USERID = message.author.id;
      const TITLE = args.split(', ')[1];
      const valid = isThisValid(args);
      if (!valid) return message.channel.send('That is not a valid input');
      let rmdDocument = await RemindModel.findOne();
      let date = findDate(args);
      if (date == false) {
        return message.channel.send(
          'That is not a valid input, try the help command to see a valid input',
        );
      }
      let returnDate = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        amOrPm: 'am',
      };
      if (returnDate.hour > 12) {
        returnDate.amOrPm = 'pm';
        returnDate.hour -= 12;
      }
      message.channel.send(
        `Okay I will remind you on ${returnDate.month}/${returnDate.day}/${returnDate.year} at ${returnDate.hour}:${returnDate.minute} ${returnDate.amOrPm}`,
      );
      if (!rmdDocument) {
        let dbModel = new RemindModel({
          reminders: [
            {
              guildid: GUILDID,
              channelid: CHANNELID,
              title: TITLE,
              date: date,
              user: USERID,
              notified: false,
            },
          ],
        });
        await dbModel.save();
      } else {
        let reminderList = rmdDocument.reminders;
        reminderList.push({
          guildid: GUILDID,
          channelid: CHANNELID,
          title: TITLE,
          date: date,
          user: USERID,
          notified: false,
        });
        newReminderList = { reminders: reminderList };
        await rmdDocument.updateOne(newReminderList);
        console.log(reminderList);
      }

      console.log(date);
      console.log(date.getHours());
    } catch (err) {
      console.log(err);
    }
  },
  aliases: ['reminder', 'remind'],
  description: '',
};
