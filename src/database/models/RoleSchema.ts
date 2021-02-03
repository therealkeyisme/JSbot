import mongoose from "mongoose";
import { Schema, model, Document, Model } from "mongoose";

export interface IRoleReactions extends Document {
  messageId: string;
  emojiRoleMappings?: any;
}

export interface RoleReactionModel extends Model<IRoleReactions> {}

export class RoleReactions {
  private _model: Model<IRoleReactions>;

  constructor() {
    const schema = new Schema({
      messageId: { type: String, required: true },
      emojiRoleMappings: { type: mongoose.Schema.Types.Mixed },
    });

    this._model = model<IRoleReactions>("message", schema);
  }
  public get model(): Model<IRoleReactions> {
    return this._model;
  }
}
