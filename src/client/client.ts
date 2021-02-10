import { Client, ClientOptions, Collection } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import BaseCommand from "../utils/structures/BaseCommand";

export default class DiscordClient extends Client {
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _prefix: string = "!";
  private _queue = new Map();
  private _cachedMessageReactions = new Map();

  constructor(options?: ClientOptions) {
    super(options);
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }
  get events(): Collection<string, BaseEvent> {
    return this._events;
  }
  get prefix(): string {
    return this._prefix;
  }
  get queue() {
    return this._queue;
  }
  get cachedMessageReactions() {
    return this._cachedMessageReactions;
  }

  set prefix(prefix: string) {
    this._prefix = prefix;
  }
}
