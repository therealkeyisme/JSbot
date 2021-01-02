const EventModel = require('../database/models/eventSchema')

const checkDbEvents = async () => {
    // let eventDocument = await eventModel
}

let informationFromUser  = async (dmChannel, embed) => {
    const filter = (m) => m.content.startsWith("")
    await dmChannel.send({ embed })
    let collected = await dmChannel.awaitMessages(filter, { max: 1, time: 30000})
    let information = collected.first().content
    return information
}

let findDate = async (startTime) => {
    
}

module.exports = { 
    checkDbEvents,
    informationFromUser,
    findDate
}