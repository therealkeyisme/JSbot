import { Schema, model, Document, Model } from "mongoose";

export interface IPreferences extends Document {
  guildid: string;
  eventChannel?: string;
}

export interface PreferenceModel extends Model<IPreferences> {}

export class Preferences {
  private _model: Model<IPreferences>;

  constructor() {
    const schema = new Schema({
      guildid: { type: String, required: true },
      eventChannel: String,
    });

    this._model = model<IPreferences>("guildPrefs", schema);
  }
  public get model(): Model<IPreferences> {
    return this._model;
  }
}
