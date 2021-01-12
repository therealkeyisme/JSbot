let helpStatement = (switchValue) => {
    switch (switchValue) {
        case 'request':
            embedMessage = `Informs the bot developer of anyr requests or issues with the software. This is helpful most likely if you want or need a new feature implimented.`;
            embedTitle = '?Request help';
            break;
        case 'roll':
            embedMessage = `Lets you roll a simple 6 sided dice.`;
            embedTitle = '?Roll help';
            break;
        case 'shopping':
            embedMessage =
                'The following are arguments for the `?shopping` command:\n-`?shopping add` adds whatever is placed after it to the list\n-`?shopping list` lists all of the items on the shopping list\n-`?shopping rem` removes an item from the shopping list\n-`?shopping clear` removes all of the items from the shopping list';
            embedTitle = '?Shopping help';
            break;
        case 'play':
            embedMessage = 'Usage - `?play <youtube-url>`';
            embedTitle = '?Play help';
            break;
        case 'skip':
            embedMessage = 'Usage - `?skip`';
            embedTitle = '?Skip help';
            break;
        case 'np':
            embedMessage = 'Usage - `?np`';
            embedTitle = '?NP help';
            break;
        case 'pause':
            embedMessage = 'Usage -`?pause`';
            embedTitle = '?Pause help';
            break;
        case 'resume':
            embedMessage = 'Usage -`?resume`';
            embedTitle = '?Resume help';
            break;
        default:
            embedMessage = `If you want more details on any of the following commands, just simply put the command name (no prefix) after the \`?help\` command
-\`?help\` displays this message
-\`?request\` sends an issue to the bot developer
-\`?roll\` rolls a dice
-\`?shopping\` maintains and stores a shopping list
-\`?play\` plays a song in the voice channel
\`?skip\` skips the current song
-\`?np\` shows the current playing song
-\`?pause\` pauses the song thats playing
-\`?resume\` continues the song that was paused
`;
            embedTitle = 'Help menu';
            break;
    }
    let embed = {
        title: embedTitle,
        color: '#63d6ff',
        description: embedMessage,
    };
    return embed;
};

let adminHelpStatement = (switchValue) => {
    switch (switchValue) {
        case 'embed':
            embedMessage =
                '`?embed channel <channelid>, title <title>, description <description>, thumbnail <thumbnail-url>`';
            embedTitle = '?Embed help';
            break;
        case 'ban':
            embedMessage = 'Usage - `?ban <userid>`';
            embedTitle = '?Ban help';
            break;
        case 'kick':
            embedMessage = 'Usage - `?kick <userid>`';
            embedTitle = '?Kick help';
            break;
        case 'mute':
            embedMessage = 'Usage - `?mute <userid>`';
            embedTitle = '?Mute help';
            break;
        case 'unmute':
            embedMessage = 'Usage - `?unmute <userid>`';
            embedTitle = '?UnMute help';
            break;
        case 'event':
            embedMessage = 'Usage -`?event`';
            embedTitle = '?Event help';
            break;
        case 'create':
            embedMessage = 'Usage -`?event`';
            embedTitle = '?Create help';
            break;
        case 'eventchannel':
            embedMessage = 'Usage -`eventchannel`';
            embedTitle = `?EventChannel help`;
        case 'addrolereaction':
            embedMessage = 'Usage -`addrolereaction` then follow my advice';
            embedTitle = `?Addrolereaction help`;
        default:
            embedMessage = `If you want more details on any of the following commands, just simply put the command name (no prefix) after the \`?adminhelp\` command
            -\`?adminhelp\` displays this message
            -\`?embed\` sends an embedded message to a specific channel
            -\`?ban\` bans people
            -\`?kick\` kicks people
            -\`?mute\` mutes a player
            -\`?unmute\` unmutes a player
            -\`?event\` creates an event
            -\`?create\` creates a channel that hosts events
            -\`?addrolereaction\` adds role reactions to a message
            -\`?eventchannel\` makes the channel this is sent in the default event channel
            `;
            embedTitle = 'Admin Help menu';
            break;
    }
    let embed = {
        title: embedTitle,
        color: '#ff0000',
        description: embedMessage,
    };
    return embed;
};

module.exports = {
    helpStatement,
    adminHelpStatement,
};
