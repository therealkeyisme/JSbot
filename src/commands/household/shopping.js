const fs = require('fs');
const { cpuUsage } = require('process');
const ShoppingModel = require('../../database/models/shoppingschema');
const { jsonReader } = require('../../utils/jsonreader');

let dbModelSaver = async(GUILDID, items) => {
    let dbShopModel = new ShoppingModel({
        serverId: GUILDID,
        shoppinglist: items
    })
    dbShopModel.save()
}
let dbUpdate = async(shopDocument, shopList) => {
    let newShopList = { shoppinglist: shopList};
    await shopDocument.updateOne(newShopList)
}

module.exports = {
    run: async (client, message, args) => {

        try {
            const GUILDID = message.guild.id;
            // message.delete({ timeout: 5000 });
            let command = args.split(' ')[0];
            let items = args.substr(4, args.length).split(', ');
            let shopDocument = await ShoppingModel.findOne({
                serverId: GUILDID,
            })
            let shopList;
            if(shopDocument){
                shopList = shopDocument.shoppinglist;
                console.log(shopDocument.shoppinglist)
            }
            if(command.toLowerCase() === "add") {
                if(!shopDocument) {
                    dbModelSaver(GUILDID, items);
                }
                else {
                    for (let i = items.length;i >= 0;i--) {
                        for (let k = 0; k < shopList.length; k++) {
                            if (
                                    shopList[k]==items[i]
                            ) {
                                items.splice(i, 1);
                                break;
                            }
                        }
                    }
                    shopList = shopList.concat(items)
                    dbUpdate(shopDocument, shopList)
                    // let newShopList = { shoppinglist: shopList}
                    // await shopDocument.updateOne(newShopList);
                }
                await message.channel.send("I have added your things to the shopping list");
            } 
            else if (command.toLowerCase() === 'rem') {
                if(!shopDocument) {
                    let items = []
                    dbModelSaver(GUILDID, items);
                }
                else {
                    
                    for (i = shopList.length; i >= 0; i--){
                        for (let k = 0; k < items.length; k++){
                            if(shopList[i] === items[k]) {
                                shopList.splice(i, 1);
                                break;
                            }
                        }
                    }
                    dbUpdate(shopDocument, shopList)
                }
                await message.channel.send("I have removed those things from the shopping list")
            } 
            else if (command.toLowerCase() === 'show' || command.toLowerCase() == 'list') {
                if(!shopDocument || shopList.length == 0){
                    if(!shopDocument){
                    let items = []
                    dbModelSaver(GUILDID, items)
                    }
                    let returnMessage ="I was not able to find your shopping list. I either lost it or you haven't given it to me yet.";
                    message.channel.send(returnMessage).then((message) =>message.delete({ timeout: 10000 }),).catch((err) => {throw err;});
                }
                else {
                    returnList = shopList.sort().join('\n');
                    console.log(returnList)
                    returnMessage = 'The following items are on your shopping list: \n ```\n' +
                    returnList +
                    '\n```';
                    console.log(returnMessage)
                    await message.channel.send(returnMessage)
                }
            } 
            else if (command.toLowerCase() === 'clear') {
                if(!shopDocument) {
                    let items = []
                    dbModelSaver(GUILDID, items);
                }
                else {
                    shopList = []
                    dbUpdate(shopDocument, shopList);
                }
                await message.channel.send("I have cleared the shopping list!")
            }
        }
        catch (err) {
            console.log(err)
        }
        

        
    },
    aliases: ["shop"],
    description: 'Maintains and stores a shopping list',
    //TODO: Finish working on this piece of code
};
