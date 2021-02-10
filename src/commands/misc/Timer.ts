import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import { ITimer } from "../../database/models/TimerSchema";
import { DateParser, eventTimeFilter } from "../../utils/DateParserFn";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class Timer extends BaseCommand {
  constructor() {
    super("timer", "misc", []);
  }

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
