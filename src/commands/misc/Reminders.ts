import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { IReminders } from "../../database/models/RemindSchema";
import { DateParser, eventTimeFilter } from "../../utils/DateParserFn";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class Events extends BaseCommand {
  constructor() {
    super("remind", "misc", ["remindme"]);
  }
  //! ?remindme 01/29/2021 9am hey do that thing
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
