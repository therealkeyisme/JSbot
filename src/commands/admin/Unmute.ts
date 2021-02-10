import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

/**
 * Removes the mute role from a guild user.
 *
 * @export Unmute
 * @class Unmute
 * @extends {BaseCommand}
 */
export default class Unmute extends BaseCommand {
  /**
   * Creates an instance of Unmute.
   * @memberof Unmute
   */
  constructor() {
    super("unmute", "admin", []);
  }

  /**
   * Function that removes a guild member from the "muted" role.
   *
   * @param {DiscordClient} client A DiscordClient instance
   * @param {Message} message The message that called the command
   * @param {Array<string>} args Everything after the command call
   * @memberof Unmute
   */
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guild = message.guild;
    const roleManager = guild.roles;
    const muteRole = roleManager.cache.find((role) => role.name == "muted");
    let user = await guild.members.fetch(args[0]);
    if (
      muteRole == undefined ||
      args.length == 0 ||
      user.roles.cache.find((role) => role == muteRole)
    )
      return;
    await user.roles.remove(muteRole);
  }
}
