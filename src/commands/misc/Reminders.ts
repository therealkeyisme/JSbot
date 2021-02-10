import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { IReminders } from "../../database/models/RemindSchema";
import { DateParser, eventTimeFilter } from "../../utils/DateParserFn";
import BaseCommand from "../../utils/structures/BaseCommand";

/**
 * Reminder Command
 *
 * @export Reminders
 * @class Reminders
 * @extends {BaseCommand}
 */
export default class Reminders extends BaseCommand {
  /**
   * Creates an instance of Reminders.
   * @memberof Reminders
   */
  constructor() {
    super("remind", "misc", ["remindme"]);
  }
  /**
   * Function that adds a reminder to the database
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Reminders
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const content = message.content;
    const argCSV = args.join(" ").split(", ");
    console.log(argCSV);
    const reminderDateObject = DateParser(argCSV[0]);
    if (!eventTimeFilter(message)) {
      message.channel.send("uhhhh what date do you want?");
      return;
    }

    let rmdDocument: IReminders = new DB.Models.Reminders({
      guildid: message.guild.id,
      channelid: message.channel.id,
      title: argCSV[1],
      date: reminderDateObject.compileDate(),
      user: message.author.id,
      notified: false,
    });

    await rmdDocument.save();

    message.channel.send(
      `Okay I will remind you on ${reminderDateObject.eventPresentDate()} to ${
        argCSV[1]
      }`
    );
  }
}
