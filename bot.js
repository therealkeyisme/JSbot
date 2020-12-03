require('dotenv').config();
const discord = require('discord.js')
const client = new discord.Client()
const PREFIX = process.env.PREFIX
client.login(process.env.BOT_TOKEN)
client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`)
})

const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(PREFIX + cmdName)
const rollDice = () => Math.floor(Math.random() * 6) + 1
const checkPermissionRole = (role) => role.permissions.has('ADMINISTRATOR') || role.permissions.has('KICK_MEMBERS') || role.permissions.has('BAN_MEMBERS') || role.permissions.has('MANAGE_GUILD') || role.permissions.has('MANAGE_CHANNELS')

client.on('message', function(message) {
    if(message.author.bot) {
        return
    }
    if(message.content === 'hello') {
        message.channel.send('hello')
    }
    if(isValidCommand(message, "hello")){
        message.reply("Hello!")
    }
    else if(isValidCommand(message, "rolldice")) {
        message.reply("rolled a " + rollDice())
    }
    else if(isValidCommand(message, "add")) {
        let args = message.content.toLowerCase().substring(6)
        let roleNames = args.split(", ")
        let roleSet = new Set(roleNames)
        let { cache } = message.guild.roles

        roleSet.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName);
            if(role) {
                if(message.member.roles.cache.has(role.id)) {
                    message.channel.send("You already have this role")
                    return;
                }
                if(checkPermissionRole(role)) {
                    message.channel.send("You cannot add yourself to this role")
                }
                else {
                    message.member.roles.add(role.id)
                        .then(member => message.channel.send("You were added to the role"))
                        .catch(err => {
                            console.log(err)
                            message.channel.send("Something went wrong")
                        })
                }
            }
            else {
                message.channel.send("Role not found")
            }
        })
        
    }
    else if(isValidCommand(message, "del")) {
        let args = message.content.toLowerCase().substring(6)
        let roleNames = args.split(", ")
        let roleSet = new Set(roleNames)
        let { cache } = message.guild.roles

        roleSet.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName);
            if(role) {
                if(message.member.roles.cache.has(role.id)) {
                    message.member.roles.remove(role.id)
                        .then(member => message.channel.send("You were removed from the role"))
                        .catch(err => {
                            console.log(err)
                            message.channel.send("Something went wrong")
                        })
                }
            }
            else {
                message.channel.send("Role not found")
            }
        })
    }
    else if(isValidCommand(message, "embed")) {
        let embedContent = message.content.substring(8)
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
        message.channel.send({ embed })
    }
})

