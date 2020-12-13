require('dotenv').config();
const discord = require('discord.js');
const client = new discord.Client();
const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require("./utils/validate");
const tableConfig = require('./utils/tableConfig');
const { createStream, table } = require('table');
const c = require('ansi-colors');
const commandStatus = [
    [`${c.bold.magenta('Command')}`, `${c.bold.magenta('Status')}`, `${c.bold.magenta('Description')}`]
];

const PREFIX = process.env.PREFIX;
const DEVID = process.env.BOT_OWNER;
client.login(process.env.BOT_TOKEN);
client.commands = new Map();

client.on('ready', () => {
    let stream = createStream(tableConfig);
    let i = 0;
    let fn = setInterval(() => {
        if (i === commandStatus.length){
            clearInterval(fn);
        } else {
            stream.write(commandStatus[i]);
            i++;
        }
    }, 100)
    console.log(`${client.user.tag} has logged in.`);
})

client.on('message', async function(message) {
    if(message.author.bot) return;
    if(message.content.toLowerCase() == "thank you") {
        message.channel.send("You're very welcome ! 🥰")
    }
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
                            if(aliases.length != 0){
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