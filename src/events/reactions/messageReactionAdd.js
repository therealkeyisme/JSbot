const EventModel = require('../../database/models/eventSchema');
const Discord = require('discord.js');
const { addMemberRole, roleReaction } = require('../../utils/events/reactionaddfn')


module.exports = async (client, reaction, user) => {
    if (reaction.message.guild.members.cache.get(user.id).user.bot) {
        return;
    }
    
    let GUILDID = reaction.message.guild.id
    let { id } = reaction.message;
    let emojiName = await reaction.emoji.name
    await reaction.message.fetch()
    await roleReaction(client, reaction, user, id)
    
    let userNickname = reaction.message.guild.members.cache.get(user.id).nickname
    if (!userNickname) {
        userNickname = reaction.message.guild.members.cache.get(user.id).user.username
    } 

    try {
        let eventDocument = await (EventModel.findOne())
        let events = eventDocument.events
        let userObject = {
            userid: user.id,
            nickname: userNickname
        }
        let reactedEvent = events.find(obj => obj.messageid === id)
        events.splice([events.indexOf(reactedEvent)])

        let userAccepted = reactedEvent.accepted
        let acceptedList = []
        let userDeclined = reactedEvent.declined
        let declinedList = []
        let userTentative = reactedEvent.tentative
        let tentativeList = []
        
        let eventDate = reactedEvent.date
        let eventMinutes = eventDate.getMinutes()
        let eventMonth = eventDate.getMonth() + 1

        console.log(userAccepted)
        console.log(userDeclined)
        console.log(userTentative)

        console.log("before the switch")
        if (emojiName === "✅") {
            userAccepted.push(userObject)
        } else if (emojiName === "🛑") {
            userDeclined.push(userObject)
        } else if (emojiName === "❔") {
            userTentative.push(userObject)
        }
        
        for (let i = 0; i<userAccepted.length; i++) {
            acceptedList.push(userAccepted[i].nickname)
        }
        for (let i = 0; i<userDeclined.length; i++) {
            declinedList.push(userDeclined[i].nickname)
        }
        for (let i = 0; i<userTentative.length; i++) {
            tentativeList.push(userTentative[i].nickname)
        }

        let acceptedString;
        let declinedString;
        let tentativeString;

        if (acceptedList.length !== 0) {
            acceptedString = acceptedList.join('\n')
        } else {
            acceptedString = '-'
        }
        if (declinedList.length !== 0) {
            declinedString = declinedList.join('\n')
        } else {
            declinedString = '-'
        }
        if (tentativeList.length !== 0) {
            tentativeString = tentativeList.join('\n')
        } else {
            tentativeString = '-'
        }
        console.log("Before the embed")
        let returnEmbed = new Discord.MessageEmbed()
            .setTitle(reactedEvent.title)
            .setDescription(reactedEvent.description)
            .addFields(
                {
                    name: "Time", value: `${eventDate.getFullYear()}-${eventMonth}-${eventDate.getDate()} ${eventDate.getHours()}:${eventMinutes}`
                },
                {
                    name: "✅Accepted",
                    value: acceptedString,
                    inline: true
                },
                {
                    name: "🛑Declined",
                    value: declinedString,
                    inline: true
                },
                {
                    name: "❔Tentative",
                    value: tentativeString,
                    inline: true
                })

        reaction.message.edit(returnEmbed)
        console.log("After the embed")
        let newReactedEvent = {
            guildid: GUILDID,
            title: reactedEvent.title,
            date: eventDate,
            description: reactedEvent.description,
            messageid: reactedEvent.messageid,
            accepted: userAccepted,
            declined: userDeclined,
            tentative: userTentative
        }
        console.log(userAccepted)
        console.log(userDeclined)
        console.log(userTentative)
        events.push(newReactedEvent)

        let newEventList = {events: events}
        await eventDocument.updateOne(newEventList)
    } 
    catch (err) {
        console.log(err)
    }
};
