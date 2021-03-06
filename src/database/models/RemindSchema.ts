import { Schema, model, Document, Model } from "mongoose";

export interface IReminders extends Document {
  guildid: string;
  channelid: string;
  title: string;
  date: number;
  user: string;
  notified: boolean;
}

export interface RemindersModel extends Model<IReminders> {}

export class Reminders {
  private _model: Model<IReminders>;

  constructor() {
    const schema = new Schema({
      guildid: String,
      channelid: String,
      title: String,
      date: Number,
      user: String,
      notified: Boolean,
    });

    this._model = model<IReminders>("rmdlist", schema);
  }
  public get model(): Model<IReminders> {
    return this._model;
  }
}
