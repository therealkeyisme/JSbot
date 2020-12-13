module.exports = {
    run: async(client, message) => {
        // #TODO: Add the music commands to help
        let embedMessage = "-`?roll` rolls a dice\n-`?request` reports a bug\n-`?shopping` maintains and stores a " +
            "shopping list\n-`?help` displays this message\n-`?ban` bans people\n-`?kick` kicks people\n-`?request` " +
            "sends an issue to the bot developer\n-`?addrole` adds a role to a player\n-`?delrole` removes a role from " +
            "a player\n-`?mute` mutes a player\n-`?unmute` unmutes a player\n-`?play` plays a song in the voice channel" +
            "\n`?skip` skips the current song\n-`?np` shows the current playing song\n-`?pause` pauses the song thats " +
            "playing"
        let embed = {
            title : "Do you need help with any of these commands?",
            color : '#63d6ff',
            description: embedMessage
        }
        await message.channel.send( {embed});
    },
    aliases: ['?'],
    description: "Lists help on all available commands"
}