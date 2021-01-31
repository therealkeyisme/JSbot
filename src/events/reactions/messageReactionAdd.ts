import Discord from 'discord.js';
import { DB } from '../../database/database';
import { roleReactionAdd } from '../../utils/events/reactionaddfn';

module.exports = async (client: any, reaction: any, user: any) => {
  if (reaction.message.guild.members.cache.get(user.id).user.bot) {
    return;
  }

  let GUILDID = reaction.message.guild.id;
  let { id } = reaction.message;
  let emojiName = await reaction.emoji.name;
  await reaction.message.fetch();
  await roleReactionAdd(client, reaction, user, id);

  let userNickname = reaction.message.guild.members.cache.get(user.id).nickname;
  if (!userNickname) {
    userNickname = reaction.message.guild.members.cache.get(user.id).user
      .username;
  }

  try {
    let eventDocument = await DB.Models.Events.findOne();
    let events = eventDocument.events;
    let userObject = {
      userid: user.id,
      nickname: userNickname,
      notified: false,
    };
    let reactedEvent = events.find((obj: any) => obj.messageid === id);
    events.splice([events.indexOf(reactedEvent)]);
    if (reactedEvent) {
      let userAccepted = reactedEvent.accepted;
      let acceptedList = [];
      let userDeclined = reactedEvent.declined;
      let declinedList = [];
      let userTentative = reactedEvent.tentative;
      let tentativeList = [];
      if (!userAccepted) userAccepted = [];
      if (!userDeclined) userDeclined = [];
      if (!userTentative) userTentative = [];

      let eventDate = reactedEvent.date;
      let eventMinutes = eventDate.getMinutes();
      let eventMonth = eventDate.getMonth() + 1;

      let userAlreadyAccepted = false;
      let userAlreadyDeclined = false;
      let userAlreadyTentative = false;
      let indexUserAlreadyAccepted;
      let indexUserAlreadyDeclined;
      let indexUserAlreadyTentative;
      for (let i = 0; i < userAccepted.length; i++) {
        if (userAccepted[i].nickname === userNickname) {
          userAlreadyAccepted = true;
          indexUserAlreadyAccepted = i;
        }
      }
      for (let i = 0; i < userDeclined.length; i++) {
        if (userDeclined[i].nickname === userNickname) {
          userAlreadyDeclined = true;
          indexUserAlreadyDeclined = i;
        }
      }
      for (let i = 0; i < userTentative.length; i++) {
        if (userTentative[i].nickname === userNickname) {
          userAlreadyTentative = true;
          indexUserAlreadyTentative = i;
        }
      }

      if (emojiName === '✅') {
        if (!userAlreadyAccepted) {
          userAccepted.push(userObject);
          if (userAlreadyDeclined)
            userDeclined.splice(indexUserAlreadyDeclined);
          if (userAlreadyTentative)
            userTentative.splice(indexUserAlreadyTentative);
        }
      } else if (emojiName === '🛑') {
        if (!userAlreadyDeclined) {
          userDeclined.push(userObject);
          if (userAlreadyAccepted)
            userAccepted.splice(indexUserAlreadyAccepted);
          if (userAlreadyTentative)
            userTentative.splice(indexUserAlreadyTentative);
        }
      } else if (emojiName === '❔') {
        if (!userAlreadyTentative) {
          userTentative.push(userObject);
          if (userAlreadyAccepted)
            userAccepted.splice(indexUserAlreadyAccepted);
          if (userAlreadyDeclined)
            userDeclined.splice(indexUserAlreadyDeclined);
        }
      }

      for (let i = 0; i < userAccepted.length; i++) {
        acceptedList.push(userAccepted[i].nickname);
      }
      for (let i = 0; i < userDeclined.length; i++) {
        declinedList.push(userDeclined[i].nickname);
      }
      for (let i = 0; i < userTentative.length; i++) {
        tentativeList.push(userTentative[i].nickname);
      }

      let acceptedString;
      let declinedString;
      let tentativeString;

      if (acceptedList.length !== 0) {
        acceptedString = acceptedList.join('\n');
      } else {
        acceptedString = '-';
      }
      if (declinedList.length !== 0) {
        declinedString = declinedList.join('\n');
      } else {
        declinedString = '-';
      }
      if (tentativeList.length !== 0) {
        tentativeString = tentativeList.join('\n');
      } else {
        tentativeString = '-';
      }
      let returnEmbed = new Discord.MessageEmbed()
        .setTitle(reactedEvent.title)
        .setDescription(reactedEvent.description)
        .addFields(
          {
            name: 'Time',
            value: `${eventDate.getFullYear()}-${eventMonth}-${eventDate.getDate()} ${eventDate.getHours()}:${eventMinutes}`,
          },
          {
            name: '✅Accepted',
            value: acceptedString,
            inline: true,
          },
          {
            name: '🛑Declined',
            value: declinedString,
            inline: true,
          },
          {
            name: '❔Tentative',
            value: tentativeString,
            inline: true,
          },
        )
        .setColor('#63d6ff');

      reaction.message.edit(returnEmbed);
      let newReactedEvent = {
        guildid: GUILDID,
        title: reactedEvent.title,
        date: eventDate,
        description: reactedEvent.description,
        messageid: reactedEvent.messageid,
        accepted: userAccepted,
        declined: userDeclined,
        tentative: userTentative,
      };
      events.push(newReactedEvent);

      let newEventList = { events: events };
      await DB.Models.Events.updateOne(newEventList);
      await reaction.users.remove(user.id);
    }
  } catch (err) {
    console.log(err);
  }
};
