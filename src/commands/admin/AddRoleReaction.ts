import {
  Emoji,
  EmojiIdentifierResolvable,
  EmojiResolvable,
  GuildEmoji,
  Message,
  MessageCollector,
  NewsChannel,
  TextChannel,
} from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class AddRoleReaction extends BaseCommand {
  constructor() {
    super("addrolereaction", "admin", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let msgCollectorFilter = (newMsg: Message, originalMsg: Message) =>
      newMsg.author.id === originalMsg.author.id;

    if (message.channel.type == "news") return;
    const channel = message.channel;
    if (!message.member.hasPermission(["ADMINISTRATOR"])) {
      message.channel.send("You don't have permission to use that command.");
      return;
    }
    if (args.length != 1) {
      message.channel.send(
        "Too many arguments. You must only provide 1 message id."
      );
      return;
    }
    let fetchedMessage = await message.channel.messages.fetch(args[0]);
    if (!fetchedMessage) {
      message.channel.send("Something went wrong.");
      return;
    }
    await message.channel.send(
      "Please provide all of the emoji names with the role name, one by one, separated with a comma .\ne.g: snapchat, snapchat, where the emoji name comes first and the role name comes second"
    );
    let collector = new MessageCollector(
      channel,
      msgCollectorFilter.bind(null, message)
    );
    let emojiRoleMappings = new Map();

    collector.on("collect", (msg: Message) => {
      let cache = msg.guild.emojis.cache;
      if (msg.content.toLowerCase() === "done") {
        collector.stop("Done command was issued");
        return;
      }
      let [emojiName, roleName] = msg.content.split(/,\s+/);
      if (!emojiName && !roleName) return;
      let emoji: GuildEmoji = cache.find(
        (emoiji) => emoji.name.toLowerCase() === emojiName.toLowerCase()
      );
      if (!emoji) {
        msg.channel.send("Emoji does not exist. Try again.");
        return;
      }
      let role = msg.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === roleName.toLowerCase()
      );
      if (!role) {
        msg.channel.send("Role does not exist. Try again.");
        return;
      }
      fetchedMessage.react(emoji).catch((err) => console.log(err));
      emojiRoleMappings.set(emoji.id, role.id);
    });

    collector.on("end", async (collected, reason) => {
      let roleRxnDocument = await DB.Models.RoleReactions.findOne({
        messageId: fetchedMessage.id,
      });
      if (roleRxnDocument)
        message.channel.send(
          "There is already a role reaction for that message"
        );
      else {
        let dbMsgModel = new DB.Models.RoleReactions({
          messageId: fetchedMessage.id,
          emojiRoleMappings: emojiRoleMappings,
        });
        dbMsgModel;
      }
    });
  }
}
