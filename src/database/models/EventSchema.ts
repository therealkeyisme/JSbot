import { Schema, model, Document, Model } from "mongoose";

/**
 * Creates a type of object that consists of the following items required for making Events: guildid, title, date, description, messageid, accepted, declined, and tentative.
 */
export interface IEvents extends Document {
  guildid: string;
  title: string;
  date: Date;
  description: string;
  messageid: string;
  accepted: Array<IUser>;
  declined: Array<IUser>;
  tentative: Array<IUser>;
}
/**
 * Creates a type of object that contains information required in accepted, declined, and tentative for IEvents
 */
export interface IUser {
  userid: string;
  nickname?: string;
  notified?: boolean;
}

export interface EventModel extends Model<IEvents> {}

/**
 * Event Database Model
 */
export class Events {
  private _model: Model<IEvents>;

  constructor() {
    const schema = new Schema({
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
    });

    /** @type {model<IEvents>} */
    this._model = model<IEvents>("eventlist", schema);
  }
  public get model(): Model<IEvents> {
    return this._model;
  }
}
