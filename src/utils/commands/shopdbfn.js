let dbModelSaver = async (GUILDID, items, lastTimeListed) => {
    let dbShopModel = new ShoppingModel({
        serverId: GUILDID,
        shoppinglist: items,
        lastShopList: lastTimeListed,
    });
    dbShopModel.save();
};
let dbUpdate = async (shopDocument, shopList) => {
    let newShopList = { shoppinglist: shopList };
    await shopDocument.updateOne(newShopList);
};

module.exports = {
    dbModelSaver,
    dbUpdate,
};
