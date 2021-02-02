import { connect, connection, Connection } from 'mongoose';
import { RoleReactionModel, RoleReactions } from './models/roleSchema';
import { EventModel, Events } from './models/eventSchema';
import { PreferenceModel, Preferences } from './models/prefSchema';
import { RemindersModel, Reminders } from './models/remindSchema';
import { Shopping, ShoppingModel } from './models/shoppingSchema';
import { Timer, TimerModel } from './models/timerSchema';

let mongoURL: any = process.env.MONGO_URL;

if (!mongoURL) {
  mongoURL = 'mongodb://localhost:27017/BabyBotDB';
  console.log('NO URL');
}

declare interface IModels {
  Events: EventModel;
  Preferences: PreferenceModel;
  Reminders: RemindersModel;
  RoleReactions: RoleReactionModel;
  Shopping: ShoppingModel;
  Timer: TimerModel;
}

export class DB {
  private static instance: DB;

  private _db: Connection;
  private _models: IModels;

  private constructor() {
    connect(mongoURL, { useNewUrlParser: true });
    this._db = connection;
    this._db.on('open', this.connected);
    this._db.on('error', this.error);

    this._models = {
      Events: new Events().model,
      Preferences: new Preferences().model,
      Reminders: new Reminders().model,
      RoleReactions: new RoleReactions().model,
      Shopping: new Shopping().model,
      Timer: new Timer().model,
      //This is where we initialize all models
    };
  }
  public static get Models() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance._models;
  }
  private connected() {
    console.log('Connected to MongoDB');
  }

  private error(err: any) {
    console.log('Mongoose has encountered an error', err);
  }
}
