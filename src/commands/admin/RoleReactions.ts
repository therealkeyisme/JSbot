import { Message, MessageCollector, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import BaseCommand from "../../utils/structures/BaseCommand";

/**
 * Turns an existing message into a role reaction message
 *
 * @export RoleReaction
 * @class RoleReaction
 * @extends {BaseCommand}
 */
export default class RoleReaction extends BaseCommand {
  /**
   * Creates an instance of RoleReaction.
   * @memberof RoleReaction
   */
  constructor() {
    super("rolereaction", "admin", []);
    super.helpStatement =
      "`?rolereaction <messageid>` sets a message as a role reaction message";
  }

  /**
   * Function that adds role reaction events to an existing message
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof RoleReaction
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const msgCollectorFiler = (
      newMsg: Message,
      originalMsg: Message
    ): boolean => {
      return newMsg.author.id === originalMsg.author.id;
    };
    if (message.channel.type == "news") return;
    if (!message.member.hasPermission(["ADMINISTRATOR"])) {
      message.channel.send("You don't have permission to use this command");
      return;
    }
    if (args.length != 1) {
      message.channel.send(
        "You need to provide the id of the message you want reactions for."
      );
      return;
    }
    let fetchedMessage = await message.channel.messages.fetch(args[0]);
    if (!fetchedMessage) {
      await message.channel.send("Something went wrong here.");
      return;
    }
    await message.channel.send(
      "Please provide all of the emoji names with the role name, one by one, separated with a comma .\ne.g: snapchat, snapchat, where the emoji name comes first and the role name comes second"
    );
    let collector = new MessageCollector(
      message.channel,
      msgCollectorFiler.bind(null, message)
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
      let emoji = cache.find(
        (emoji) => emoji.name.toLowerCase() === emojiName.toLowerCase()
      );
      let role = msg.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === roleName.toLowerCase()
      );
      if (!emoji) {
        msg.channel.send("That emoji does not exist");
        return;
      }
      if (!role) {
        msg.channel.send("That role does not exist");
        return;
      }
      fetchedMessage.react(emoji);
      emojiRoleMappings.set(emoji.id, role.id);
    });
    collector.on("end", async (collected, reason) => {
      let findMsgDocument = await DB.Models.RoleReactions.findOne({
        messageId: fetchedMessage.id,
      });
      if (findMsgDocument) {
        message.channel.send(
          "There is already a role reaction for that message"
        );
        return;
      }
      let dbMsgModel = new DB.Models.RoleReactions({
        messageId: fetchedMessage.id,
        emojiRoleMappings: emojiRoleMappings,
      });
      dbMsgModel.save();
    });
  }
}
