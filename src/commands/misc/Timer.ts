import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { ITimer } from "../../database/models/TimerSchema";
import { DateParser, eventTimeFilter } from "../../utils/DateParserFn";
import BaseCommand from "../../utils/structures/BaseCommand";

/**
 * Creates a timer command
 *
 * @export Timer
 * @class Timer
 * @extends {BaseCommand}
 */
export default class Timer extends BaseCommand {
  /**
   * Creates an instance of Timer.
   * @memberof Timer
   */
  constructor() {
    super("timer", "misc", []);
  }

  /**
   * Function that creates a timer.
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Timer
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const argString = args.join(" ");
    const timerDateObject = DateParser(argString);
    if (!eventTimeFilter(message)) {
      message.channel.send("Uhhhh when do you want your timer to go off?");
      return;
    }

    let timerDocument: ITimer = new DB.Models.Timer({
      channelid: message.channel.id,
      date: timerDateObject.compileDate(),
      user: message.author.id,
      notified: false,
    });

    await timerDocument.save();
  }
}
