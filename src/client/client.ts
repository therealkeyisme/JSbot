import { Client, ClientOptions, Collection, MessageEmbed } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import BaseCommand from "../utils/structures/BaseCommand";

/**
 * Initiates a discord.js Client object that has commands, events, prefix, queue, and cachedMessageReactions
 *
 * @export DiscordClient
 * @class DiscordClient
 * @extends {Client}
 */
export default class DiscordClient extends Client {
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _prefix: string = "!";
  private _queue = new Map();
  private _cachedMessageReactions = new Map();
  /**
   * Creates an instance of DiscordClient.
   * @param {ClientOptions} [options]
   * @memberof DiscordClient
   */
  constructor(options?: ClientOptions) {
    super(options);
  }
  /**
   * Gets the commands in the DiscordClient instance.
   * @readonly
   * @type {Collection<string, BaseCommand>}
   * @memberof DiscordClient
   */
  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }
  /**
   * Gets the events in the DiscordClient instance.
   * @readonly
   * @type {Collection<string, BaseEvent>}
   * @memberof DiscordClient
   */
  get events(): Collection<string, BaseEvent> {
    return this._events;
  }
  /**
   * Gets the prefix in the DiscordClient instance.
   * @readonly
   * @type {string}
   * @memberof DiscordClient
   */
  get prefix(): string {
    return this._prefix;
  }

  /**
   * Gets the music queue of the DiscordClient instance.
   * @readonly
   * @memberof DiscordClient
   */
  get queue() {
    return this._queue;
  }
  /**
   * Gets the cached message reactions of the DiscordClient instance.
   * @readonly
   * @memberof DiscordClient
   */
  get cachedMessageReactions() {
    return this._cachedMessageReactions;
  }
  /**
   * Changes the prefix of the DiscordClient instance.
   * @memberof DiscordClient
   */
  set prefix(prefix: string) {
    this._prefix = prefix;
  }
  /**
   * Get's the help statements from each command that has one and returns it.
   *
   * @return {MessageEmbed} Returns a message embed to be sent
   * @memberof DiscordClient
   */
  public helpList() {
    let sendEmbed = new MessageEmbed({
      title: "Help list",
    });
    let description: string = "";
    this.commands.forEach((command) => {
      if (command.helpStatement != undefined) {
        description = description + "\n" + command.helpStatement;
        console.log(command.getName());
      }
    });
    sendEmbed.setDescription(description);
    console.log(description);
    return sendEmbed;
  }
}
