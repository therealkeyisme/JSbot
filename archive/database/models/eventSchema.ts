import { Schema, model, Document, Model } from 'mongoose';

declare interface IEvents extends Document {
  guildid: string;
  title: string;
  date: any;
  description: string;
  messageid: string;
  accepted: [
    {
      userid?: string;
      nickname?: string;
      notified?: boolean;
    },
  ];
  declined: [
    {
      userid?: string;
      nickname?: string;
    },
  ];
  tentative: [
    {
      userid?: string;
      nickname?: string;
    },
  ];
}

export interface EventModel extends Model<IEvents> {}

export class Events {
  private _model: Model<IEvents>;

  constructor() {
    const schema = new Schema({
      events: [
        {
          guildid: String,
          title: String,
          date: Date,
          description: String,
          messageid: String,
          accepted: [
            {
              userid: String,
              nickname: String,
              notified: Boolean,
            },
          ],
          declined: [
            {
              userid: String,
              nickname: String,
            },
          ],
          tentative: [
            {
              userid: String,
              nickname: String,
            },
          ],
        },
      ],
    });

    this._model = model<IEvents>('eventlist', schema);
  }
  public get model(): Model<IEvents> {
    return this._model;
  }
}
