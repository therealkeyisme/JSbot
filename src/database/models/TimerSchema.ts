import { Schema, model, Document, Model } from "mongoose";

export interface ITimer extends Document {
  channelid: string;
  date: Date;
  user: string;
  notified: boolean;
}

export interface TimerModel extends Model<ITimer> {}

export class Timer {
  private _model: Model<ITimer>;

  constructor() {
    const schema = new Schema({
      channelid: String,
      date: Date,
      user: String,
      notified: Boolean,
    });

    this._model = model<ITimer>("timerlist", schema);
  }

  public get model(): Model<ITimer> {
    return this._model;
  }
}
