const { messageCollector, MessageCollector } = require('discord.js');

let msgCollectorFilter = (newMsg, originalMsg) => {
    let isSameAuthor = newMsg.author.id === originalMsg.author.id;

};

module.exports = {
    run: async(client, message, args) => {
    
        if(args.split(/\s+/).length !== 1) {
            let msg = await message.channel.send("Too many arguments. Must only provide 1 message id");
            await msg.delete({ timeout: 2500 }).catch(err => {
                console.log(err);
            });
        }         
        else {        
            try{  
                let fetchedMessage = await message.channel.messages.fetch(args);
                if(fetchedMessage) {
                    let collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message));
                    message.channel.send("Please provide all of the emoji names with the role name.")
                    collector.on('collect', msg => {
                        console.log(`${msg.content} was collected`)
                    })
                }
            }
            catch(err) {
                console.log(err);
                let msg = await message.channel.send("Invalid ID. Message was not found.");
                await msg.delete({ timeout: 3500 }).catch(err => console.log(err));
            }
        }
            
        
    },    
    aliases: [],
    description: "Creates message for giving roles"
}