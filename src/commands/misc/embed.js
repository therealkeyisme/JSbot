module.exports = {
    run: async (client, message, args) => {
        if (args.toLowerCase() === '?embed') {
            return message.channel.send(
                'You need to make sure you give me some arguments so I know where everything goes.',
            );
        } else if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send(
                "You don't have permissions to use this command",
            );
        }
        args = args.split(', ');
        let { cache } = message.guild.roles;

        let embedChannel = client.channels.cache.get(args[0].substring(8));
        let embedTitle = args[1].substring(6);
        let embedDescription = args[2].substring(12);
        let embedAuthor = message.author.username;
        if (args[3] === undefined) {
            embedThumbnail = message.author.displayAvatarURL();
        } else {
            embedThumbnail = args[3].substring(10);
        }
        embedThumbnail = {
            url: embedThumbnail,
            height: 25,
            width: 25,
        };
        let embedTimestamp = new Date();

        let embed = {
            title: embedTitle,
            description: embedDescription,
            thumbnail: embedThumbnail,
            timestamp: embedTimestamp,
            author: embedAuthor,
        };
        embedChannel.send({ embed });
        return message.delete({ timeout: 15000 });
    },
    aliases: [],
    description: 'Creates an embed',
};
