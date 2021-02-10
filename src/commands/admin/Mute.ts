import { Collector, Guild, Message, RoleData } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

/**
 * Adds guild member to the "muted" role in the guild.
 * @export Mute
 * @class Mute
 * @extends {BaseCommand}
 */
export default class Mute extends BaseCommand {
  /**
   * Creates an instance of Mute.
   * @memberof Mute
   */
  constructor() {
    super("mute", "admin", []);
  }

  /**
   * Function that adds guild member to the "muted" role.
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Mute
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guild = message.guild;
    let roleManager = guild.roles;
    let muteRole = roleManager.cache.find((role) => role.name == "muted");
    let user = await guild.members.fetch(args[0]);
    if (
      muteRole == undefined ||
      args.length == 0 ||
      user.roles.cache.find((role) => role == muteRole)
    )
      return;
    await user.roles.add(muteRole);
    return;
  }
}
