const ShoppingModel = require('../../database/models/shoppingSchema');
const { dbModelSaver, dbUpdate } = require('../../utils/commands/shopdbfn');

module.exports = {
    run: async (client, message, args) => {
        try {
            const GUILDID = message.guild.id;
            // message.delete({ timeout: 5000 });
            let command = args.split(' ')[0];
            let items = args.substr(4, args.length).split(', ');
            let shopDocument = await ShoppingModel.findOne({
                serverId: GUILDID,
            });
            let shopList;
            let lastTimeListed;
            if (shopDocument) {
                shopList = shopDocument.shoppinglist;
                lastTimeListed = shopDocument.lastShopList;
                if (lastTimeListed && shopList.length !== 0) {
                    try {
                        lastTimeListed = await message.channel.messages.fetch(
                            lastTimeListed,
                        );
                        lastTimeListed = await lastTimeListed.unpin();
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
            if (command.toLowerCase() === 'add') {
                if (!shopDocument) {
                    let lastTimeListed = '';
                    dbModelSaver(GUILDID, items, lastTimeListed);
                } else {
                    for (let i = items.length; i >= 0; i--) {
                        for (let k = 0; k < shopList.length; k++) {
                            if (shopList[k] === items[i]) {
                                items.splice(i, 1);
                                break;
                            }
                        }
                    }
                    shopList = shopList.concat(items);
                    dbUpdate(shopDocument, shopList);
                    // let newShopList = { shoppinglist: shopList}
                    // await shopDocument.updateOne(newShopList);
                }
                await message.channel.send(
                    'I have added your things to the shopping list',
                );
            } else if (command.toLowerCase() === 'rem') {
                if (!shopDocument) {
                    let items = [];
                    let newShopList = '';
                    dbModelSaver(GUILDID, items);
                } else {
                    for (i = shopList.length; i >= 0; i--) {
                        for (let k = 0; k < items.length; k++) {
                            if (shopList[i] === items[k]) {
                                shopList.splice(i, 1);
                                break;
                            }
                        }
                    }
                    dbUpdate(shopDocument, shopList);
                }
                await message.channel.send(
                    'I have removed those things from the shopping list',
                );
            } else if (
                command.toLowerCase() === 'show' ||
                command.toLowerCase() == 'list'
            ) {
                if (!shopDocument || shopList.length == 0) {
                    if (!shopDocument) {
                        let items = [];
                        dbModelSaver(GUILDID, items);
                    }
                    let returnMessage =
                        "I was not able to find your shopping list. I either lost it or you haven't given it to me yet.";
                    message.channel
                        .send(returnMessage)
                        .then((message) => message.delete({ timeout: 10000 }))
                        .catch((err) => {
                            throw err;
                        });
                } else {
                    returnList = shopList.sort().join('\n');
                    returnMessage =
                        'The following items are on your shopping list: \n ```\n' +
                        returnList +
                        '\n```';
                    let msg = message.channel.send(returnMessage);
                    await msg.pin();
                    lastTimeListed = { lastShopList: msg.id };
                    await shopDocument.updateOne(lastTimeListed);
                }
            } else if (command.toLowerCase() === 'clear') {
                if (!shopDocument) {
                    let items = [];
                    dbModelSaver(GUILDID, items);
                } else {
                    shopList = [];
                    dbUpdate(shopDocument, shopList);
                }
                await message.channel.send('I have cleared the shopping list!');
            }
        } catch (err) {
            console.log(err);
        }
    },
    aliases: ['shop'],
    description: 'Maintains and stores a shopping list',
};