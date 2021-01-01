const mongoose = require('mongoose');
const ShoppingSchema = new mongoose.Schema({
    serverId: { type: String, required: true },
    shoppinglist: [String],
    lastShopList: { type: String }
});

const ShoppingModel = (module.exports = mongoose.model(
    'shoplist',
    ShoppingSchema,
));
