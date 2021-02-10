import { Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { regExpObj, weekDayList } from "../../utils/Constants";
import { IEvents } from "../../database/models/EventSchema";
import { DateParser, eventTimeFilter } from "../../utils/DateParserFn";
import { DB } from "../../database/database";
import { IPreferences } from "../../database/models/PrefSchema";

export default class Events extends BaseCommand {
  constructor() {
    super("event", "events", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const titleDescriptionFilter = (message: Message): boolean =>
      message == message;
    const guild = message.guild;
    const guildid = guild.id;
    const channel = message.channel;
    const author = message.author;
    if (!message.guild) return;
    if (!message.member.hasPermission(["ADMINISTRATOR"])) {
      channel.send("You don't have permission to use that command");
      return;
    }
    const authorDM = await author.createDM();
    let sendEmbed = new MessageEmbed({
      title: "Please enter the event title",
    });

    await authorDM.send(sendEmbed);
    const eventTitle = await authorDM.awaitMessages(titleDescriptionFilter, {
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const eventTitleContent = eventTitle.first().content;
    sendEmbed.title = "Please enter the event description";
    await authorDM.send(sendEmbed);
    const eventDescription = await authorDM.awaitMessages(
      titleDescriptionFilter,
      {
        max: 1,
        time: 60000,
        errors: ["time"],
      }
    );
    const eventDescriptionContent = eventDescription.first().content;
    sendEmbed.title = "When do you want your event to start (PST)?";
    sendEmbed.description =
      "Please format it like the following\n```Friday at 9pm\nNow\nTomorrow at 18:00\nMM-DD-YYYY 7:00pm```";
    await authorDM.send(sendEmbed);
    const eventTimeIntake = await authorDM.awaitMessages(eventTimeFilter, {
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const eventTimeIntakeContent = eventTimeIntake.first().content;
    authorDM.send(
      "Okay we have all the information we need. Check out the events channel!"
    );

    let eventDateObject = DateParser(eventTimeIntakeContent);
    console.log(eventDateObject.compileDate().getTime());
    let eventTime = eventDateObject.compileDate();
    let embedPresentDate = eventDateObject.eventPresentDate();
    sendEmbed = new MessageEmbed({
      title: eventTitleContent,
      description: eventDescriptionContent,
      fields: [
        {
          name: "Time",
          value: embedPresentDate,
        },
        { name: "✅Accepted", value: "-", inline: true },
        { name: "🛑Declined", value: "-", inline: true },
        { name: "❔Tentative", value: "-", inline: true },
      ],
      color: "#63d6ff",
    });
    let prefModel: IPreferences = await DB.Models.Preferences.findOne({
      guildid: guildid,
    });
    let sentMessage: Message;
    if (!prefModel) {
      sentMessage = await channel.send(sendEmbed);
    } else {
      let eventChannel: any = guild.channels.cache.get(prefModel.eventChannel);
      sentMessage = await eventChannel.send(sendEmbed);
    }

    let eventObject = new DB.Models.Events({
      guildid: guildid,
      title: eventTitleContent,
      date: eventTime,
      description: eventDescriptionContent,
      messageid: sentMessage.id,
      accepted: [],
      declined: [],
      tentative: [],
    });

    eventObject.save();
    sentMessage.react("✅");
    sentMessage.react("🛑");
    sentMessage.react("❔");
  }
}
