import { Schema, model, Document, Model } from 'mongoose';

declare interface IShopping extends Document {
  serverId: String;
  shoppinglist?: Array<string>;
  lastShopList?: string;
}

export interface ShoppingModel extends Model<IShopping> {}

export class Shopping {
  private _model: Model<IShopping>;

  constructor() {
    const schema = new Schema({
      serverId: { type: String, required: true },
      shoppinglist: [String],
      lastShopList: { type: String },
    });

    this._model = model<IShopping>('shoppinglist', schema);
  }
  public get model(): Model<IShopping> {
    return this._model;
  }
}
