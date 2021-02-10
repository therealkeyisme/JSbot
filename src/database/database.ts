import { connect, connection, Connection } from "mongoose";
import { RoleReactionModel, RoleReactions } from "./models/RoleSchema";
import { EventModel, Events } from "./models/EventSchema";
import { PreferenceModel, Preferences } from "./models/PrefSchema";
import { RemindersModel, Reminders } from "./models/RemindSchema";
import { Shopping, ShoppingModel } from "./models/ShoppingSchema";
import { Timer, TimerModel } from "./models/TimerSchema";
import * as config from "../../config.json";

let mongoURL = config.db;

if (mongoURL) {
  mongoURL = "mongodb://localhost:27017/BabyBotDB";
  console.log("NO URL");
}

declare interface IModels {
  Events: EventModel;
  Preferences: PreferenceModel;
  Reminders: RemindersModel;
  RoleReactions: RoleReactionModel;
  Shopping: ShoppingModel;
  Timer: TimerModel;
}

/**
 * Class Representing Our Database Handler
 */
export class DB {
  private static instance: DB;

  private _db: Connection;
  private _models: IModels;

  private constructor() {
    connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    this._db = connection;
    this._db.on("open", this.connected);
    this._db.on("error", this.error);
    /** @type {IModels} */
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

  /** */
  public static get Models() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance._models;
  }

  /** logs connection status to  */
  private connected() {
    console.log("Connected to MongoDB");
  }
  /**
   * Logs any errors with the database to the console
   * @param err Error code that is logged to the console
   */
  private error(err: any) {
    console.log("Mongoose has encountered an error", err);
  }
}
