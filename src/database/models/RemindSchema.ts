import { Schema, model, Document, Model } from 'mongoose';

declare interface IReminders extends Document {
  reminders: [
    {
      guildid: string;
      channelid: string;
      title: string;
      date: any;
      user: string;
      notified: boolean;
    },
  ];
}

export interface RemindersModel extends Model<IReminders> {}

export class Reminders {
  private _model: Model<IReminders>;

  constructor() {
    const schema = new Schema({
      reminders: [
        {
          guildid: String,
          channelid: String,
          title: String,
          date: Date,
          user: String,
          notified: Boolean,
        },
      ],
    });

    this._model = model<IReminders>('rmdlist', schema);
  }
  public get model(): Model<IReminders> {
    return this._model;
  }
}
