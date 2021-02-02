import { Collector, Guild, Message, RoleData } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class Mute extends BaseCommand {
  constructor() {
    super("mute", "admin", []);
  }

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
