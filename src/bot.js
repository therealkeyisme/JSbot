require('dotenv').config();
const discord = require('discord.js');
const client = new discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require("./utils/validate");
const tableConfig = require('./utils/tableConfig');
const { createStream } = require('table');
const c = require('ansi-colors');
const database = require('./database/database')
const MessageModel = require('./database/models/message')
const cachedMessageReactions = new Map();

const PREFIX = process.env.PREFIX;
const DEVID = process.env.BOT_OWNER;
client.login(process.env.BOT_TOKEN);
client.commands = new Map();
client.queue = new Map();

const commandStatus = [
    [`${c.bold.magenta('Command')}`, `${c.bold.magenta('Status')}`, `${c.bold.magenta('Description')}`]
];

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    database.then(() => console.log("Connected to MongoDB."))
    // let stream = createStream(tableConfig);
    // let i = 0;
    // let fn = setInterval(() => {
    //     if (i === commandStatus.length){
    //         clearInterval(fn);
    //     } else {
    //         stream.write(commandStatus[i]);
    //         i++;
    //     }
    // }, 100);
});

client.on('message', async function(message) {
    if(message.author.bot) return;
    if(message.content.toLowerCase() === "thank you" || message.content.toLowerCase() === "thenk you") 
        return message.channel.send("You're very welcome ! 🥰");

    if(message.content.toLowerCase() === "i love you babybot") 
        return message.channel.send("ily 2 ");
    
    if(!message.content.startsWith(PREFIX)) return;
    let cmdName = message.content.substring(message.content.indexOf(PREFIX) + 1).split(new RegExp(/\s+/)).shift();
    let argsToParse = message.content.substring(message.content.indexOf(" ") + 1);

    if(client.commands.get(cmdName)) {
        client.commands.get(cmdName)(client, message, argsToParse, DEVID);
    }
    else {
        await message.channel.send("I don't understand you :(( \ncan you please speak in 1s and 0s?")
    }
});

client.on('messageReactionAdd', async(reaction, user) => {
    let addMemberRole = (emojiRoleMappings) => {
        if(emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
            let roleId = emojiRoleMappings[reaction.emoji.id];
            let role = reaction.message.guild.roles.cache.get(roleId);
            let member = reaction.message.guild.members.cache.get(user.id);
            if(role && member){
                member.roles.add(role);
            }
        }
    }
    if(reaction.message.partial) {
        await reaction.message.fetch()
        let { id } = reaction.message;
        try {
            let msgDocument = await MessageModel.findOne({ messageId: id });
            if(msgDocument) {
                cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
                let { emojiRoleMappings } = msgDocument;
                addMemberRole(emojiRoleMappings);
            }
        }
        catch (err) {
            console.log(err);
        };
    } 
    else {
        let emojiRoleMappings = cachedMessageReactions.get(reaction.message.id);
        addMemberRole(emojiRoleMappings);
    }
});

client.on('messageReactionRemove', async(reaction, user) => {
    let removeMemberRole = (emojiRoleMappings) => {
        if(emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
            let roleId = emojiRoleMappings[reaction.emoji.id];
            let role = reaction.message.guild.roles.cache.get(roleId);
            let member = reaction.message.guild.members.cache.get(user.id);
            if(role && member){
                member.roles.remove(role);
            }
        }
    }
    if(reaction.message.partial) {
        await reaction.message.fetch();
        let { id } = reaction.message;
        try {
            let msgDocument = await MessageModel.findOne({ messageId: id });
            if(msgDocument) {
                cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
                let { emojiRoleMappings } = msgDocument;
                removeMemberRole(emojiRoleMappings);
            }
        }
        catch (err) {
            console.log(err);
        };
    }
    else {
        let emojiRoleMappings = cachedMessageReactions.get(reaction.message.id);
        removeMemberRole(emojiRoleMappings)
    }
});

(async function registerCommands(dir = 'commands') {
    // Read the directory/file.
    let files = await fs.readdir(path.join(__dirname, dir));
    // Loop through each file.
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory()) // If file is a directory, recursive call recurDir
            registerCommands(path.join(dir, file));
        else {
            // Check if file is a .js file.
            if(file.endsWith(".js")) {
                let cmdName = file.substring(0, file.indexOf(".js"));
                try {
                    let cmdModule = require(path.join(__dirname, dir, file));
                    if(checkCommandModule(cmdName, cmdModule)) {
                        if(checkProperties(cmdModule)) {
                            let { aliases } = cmdModule;
                            client.commands.set(cmdName, cmdModule.run);
                            if(aliases.length !== 0){
                                aliases.forEach(alias => client.commands.set(alias, cmdModule.run));
                            }
                            commandStatus.push(
                                [`${c.green(`${cmdName}`)}`, `${c.green('Success!')}`, `${c.green(`${cmdModule.description}`)}`]
                            );
                        }
                    } 
                    
                } 
                catch (err) {
                    commandStatus.push(
                        [`${c.red(`${cmdName}`)}`, `${c.red(`Failed!`)}`, `${c.red(`${err}`)}`]
                    );
                }
                
            }
        }
    }
})();