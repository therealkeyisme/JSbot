import { MessageReaction, User } from "discord.js";
import DiscordClient from "../client/client";
import BaseEvent from "../utils/structures/BaseEvent";

export default class MessageReactionAdd extends BaseEvent {
  constructor() {
    super("messageReactionAdd");
  }

  async run(client: DiscordClient, reaction: MessageReaction, user: User) {
    console.log("There was a reaction");
  }
}
