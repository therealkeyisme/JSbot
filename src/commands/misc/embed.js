module.exports = {
    run:  async(client, message, args) => {
        let embedContent = message.content.substring(8);
            /*let embed = new discord.MessageEmbed()
            embed.setDescription(embedContent)
            embed.addField('message', embedContent)
            embed.setColor('#63d6ff')
            embed.setTimestamp()
            embed.setTitle("This is an embedded message")
            embed.setImage(message.author.displayAvatarURL())
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL())
            embed.setThumbnail(message.author.displayAvatarURL)
            message.channel.send(embed)*/

        let embed = {
            image : {
                URL : message.author.displayAvatarURL()
            },
            description : embedContent,
            thumbnail : {
                url : message.author.displayAvatarURL(),
                height : 25,
                width : 25
            },
            timestamp : new Date()
        }
        message.channel.send({ embed });
    },
    aliases: [],
    description: "Creates an embed"
}