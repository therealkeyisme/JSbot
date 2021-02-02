import { DB } from '../../database/database';

export const dbModelSaver = async (
  GUILDID: string,
  items: Array<string>,
  lastTimeListed: string,
) => {
  let dbShopModel = new DB.Models.Shopping({
    serverId: GUILDID,
    shoppinglist: items,
    lastShopList: lastTimeListed,
  });
  dbShopModel.save();
};
export const dbUpdate = async (shopDocument: any, shopList: any) => {
  let newShopList = { shoppinglist: shopList };
  await shopDocument.updateOne(newShopList);
};

module.exports = {
  dbModelSaver,
  dbUpdate,
};
