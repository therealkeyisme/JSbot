import { MessageEmbed, MessageReaction, User } from "discord.js";
import { IEvents, IUser } from "../../database/models/EventSchema";

/**
 * Handles what happens when someone reacts on an event.
 *
 * @param {MessageReaction} reaction The reaction from the user.
 * @param {User} user The user who reacted.
 * @param {IEvents} eventDocument A document from the database that contains an event
 * @returns Description of what the function/method returns
 */
export const eventReaction = async (
  reaction: MessageReaction,
  user: User,
  eventDocument: IEvents
) => {
  const emojiName = await reaction.emoji.name;
  const reactionMessage = await reaction.message.fetch();
  if (eventDocument) {
    let userNickname = (await reaction.message.guild.members.fetch(user.id))
      .nickname;
    if (userNickname == null) {
      userNickname = user.username;
    }
    let userObject: IUser = {
      userid: user.id,
      nickname: userNickname,
    };
    let isInEventDocumentList = (element: IUser) => element.userid == user.id;
    let accepted = eventDocument.accepted;
    let declined = eventDocument.declined;
    let tentative = eventDocument.tentative;
    let acceptedUserIndex = accepted.findIndex(isInEventDocumentList);
    let declinedUserIndex = declined.findIndex(isInEventDocumentList);
    let tentativeUserIndex = tentative.findIndex(isInEventDocumentList);

    switch (emojiName) {
      case "✅":
        if (acceptedUserIndex > 0) break;
        if (declinedUserIndex > 0) declined.splice(declinedUserIndex, 1);
        if (tentativeUserIndex > 0) tentative.splice(tentativeUserIndex, 1);
        userObject.notified = false;
        accepted.push(userObject);
        break;
      case "🛑":
        if (declinedUserIndex > 0) break;
        if (acceptedUserIndex > 0) accepted.splice(acceptedUserIndex, 1);
        if (tentativeUserIndex > 0) tentative.splice(tentativeUserIndex, 1);
        declined.push(userObject);
        break;
      case "❔":
        if (tentativeUserIndex > 0) break;
        if (acceptedUserIndex > 0) accepted.splice(acceptedUserIndex, 1);
        if (declinedUserIndex > 0) declined.splice(declinedUserIndex, 1);
        tentative.push(userObject);
        break;
      default:
        break;
    }

    /**
     * Creates a list of nicknames for accepted, declined, and tentative.
     *
     * @param {Array<IUser>} newArray Array of IUser objects for accepted, declined, or tentative
     * @return {String} A list of nicknames for accepted, declined, or tentative turned into a string.
     */
    const createNicknameList = (newArray: Array<IUser>): string => {
      let nicknameArray = [];
      for (let i = 0; i < newArray.length; i++)
        if (newArray[i].nickname) nicknameArray.push(newArray[i].nickname);
      if (nicknameArray.length > 0) return nicknameArray.join("\n");
      else return "-";
    };
    const acceptedNicknames = createNicknameList(accepted);
    const declinedNicknames = createNicknameList(declined);
    const tentativeNicknames = createNicknameList(tentative);

    /**
     * Translates minutes == 0 to minutes = "00"
     *
     * @return {string} returns minutes
     */
    let returnMinutes = (): string => {
      if (eventDocument.date.getMinutes() == 0) return "00";
      else return `${eventDocument.date.getMinutes()}`;
    };

    let sendEmbed = new MessageEmbed({
      title: eventDocument.title,
      description: eventDocument.description,
      fields: [
        {
          name: "Time",
          value: `${
            eventDocument.date.getMonth() + 1
          }/${eventDocument.date.getDate()}/${eventDocument.date.getFullYear()} at ${eventDocument.date.getHours()}:${returnMinutes()}`,
          inline: false,
        },
        { name: "✅Accepted", value: `${acceptedNicknames}`, inline: true },
        { name: "🛑Declined", value: `${declinedNicknames}`, inline: true },
        {
          name: "❔Tentative",
          value: `${tentativeNicknames}`,
          inline: true,
        },
      ],
      color: "#63d6ff",
    });
    reactionMessage.edit(sendEmbed);

    eventDocument.accepted = accepted;
    eventDocument.declined = declined;
    eventDocument.tentative = tentative;
    await eventDocument.updateOne(eventDocument);
    await reaction.users.remove(user.id);
  }
};
