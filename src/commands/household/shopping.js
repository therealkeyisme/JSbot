const fs = require('fs');
const { jsonReader } = require('../../utils/jsonreader')

// TODO: Clean up this code
module.exports = {
    run: async(client, message, args) => {
        const GUILDID = message.guild.id;

        let command = args.split(" ")[0];

        if (command.toLowerCase() === "add") {
            let items = args.substr(4, args.length).split(', ');
            jsonReader('src/data/botdata.json', (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let j = -1;
                    // let newShoppingList = ["cheese", "milk"]
                    for(let i = 0; i < data.server.length; i++) {
                        if (data.server[i].serverid === GUILDID) {
                            j = i;
                        }
                    }
                    if (data.server[j] === undefined) {
                        let newServerData = {
                            "serverid": GUILDID,
                            "shoppinglist": items
                        }
                        data.server.push(newServerData);
                        console.log(data)
                    }
                    else {

                        for (i = data.server[j].shoppinglist.length; i >= 0; i--) {
                            for (let k = 0; k < items.length; k++) {
                                if (data.server[j].shoppinglist[i] == items[k]) {
                                    items.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        console.log(items)

                        data.server[j].shoppinglist = data.server[j].shoppinglist.concat(items);
                    }
                    fs.writeFile('src/data/botdata.json', JSON.stringify(data, null, 2), err => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            message.channel.send("Your items have been added to the shopping list")
                        }
                    })
                }
            });
            console.log(`Added ${items} to shopping list`);
        } else if (command.toLowerCase() === "rem") {
            let items = args.substr(4, args.length).split(', ');
            jsonReader('src/data/botdata.json', (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let j = -1;
                    // let newShoppingList = ["cheese", "milk"]
                    for(let i = 0; i < data.server.length; i++) {
                        if (data.server[i].serverid === GUILDID) {
                            j = i;
                        }
                    }
                    if (data.server[j] === undefined) {
                        let newServerData = {
                            "serverid": GUILDID,
                            "shoppinglist": []
                        }
                        data.server.push(newServerData);
                    }
                    else {

                        for (i = data.server[j].shoppinglist.length; i >= 0; i--) {
                            for (let k = 0; k < items.length; k++) {
                                if (data.server[j].shoppinglist[i] == items[k]) {
                                    data.server[j].shoppinglist.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        console.log(items)

                    }
                    fs.writeFile('src/data/botdata.json', JSON.stringify(data, null, 2), err => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            message.channel.send("Your items have been removed from the shopping list")
                        }
                    })
                }
            });
        } else if (command.toLowerCase() === "show" || command.toLowerCase() === "list") {
            jsonReader('src/data/botdata.json', (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let j = -1;
                    // let newShoppingList = ["cheese", "milk"]
                    for(let i = 0; i < data.server.length; i++) {
                        if (data.server[i].serverid === GUILDID) {
                            j = i;
                        }
                    }
                    if (data.server[j] === undefined || data.server[j].shoppinglist[0] === undefined) {
                        let returnMessage = "I was not able to find your shopping list. I either lost it or you haven't given it to me yet."
                        message.channel.send(returnMessage);
                    }
                    else {
                        
                        returnList = data.server[j].shoppinglist.sort().join('\n')
                        returnMessage = "The following items are on your shopping list: \n ```" + returnList + "```"
                        console.log(data.server[j].shoppinglist)
                        message.channel.send(returnMessage);
                    }
                }
            });
        } else if (command.toLowerCase() === "clear") {
            jsonReader('src/data/botdata.json', (err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let j = -1;
                    // let newShoppingList = ["cheese", "milk"]
                    for(let i = 0; i < data.server.length; i++) {
                        if (data.server[i].serverid === GUILDID) {
                            j = i;
                        }
                    }
                    if (data.server[j] === undefined) {
                        let newServerData = {
                            "serverid": GUILDID,
                            "shoppinglist": []
                        }
                        data.server.push(newServerData);
                    }
                    else {
                        data.server[j].shoppinglist = [];
                    }
                    fs.writeFile('src/data/botdata.json', JSON.stringify(data, null, 2), err => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            message.channel.send("Your shopping list has been cleared.")
                        }
                    })
                }
            });
        };
    },
    aliases: [],
    description: "Maintains and stores a shopping list"
}