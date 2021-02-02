import { Schema, model, Document, Model } from 'mongoose';

declare interface ITimer extends Document {
  timers: [
    {
      channelid: string;
      date: any;
      user: string;
    },
  ];
}

export interface TimerModel extends Model<ITimer> {}

export class Timer {
  private _model: Model<ITimer>;

  constructor() {
    const schema = new Schema({
      timers: [
        {
          channelid: String,
          date: Date,
          user: String,
        },
      ],
    });

    this._model = model<ITimer>('timerlist', schema);
  }

  public get model(): Model<ITimer> {
    return this._model;
  }
}
