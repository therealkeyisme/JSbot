import DiscordClient from "../client/client";
import BaseEvent from "../utils/structures/BaseEvent";

export default class ChannelCreate extends BaseEvent {
  constructor() {
    super("channelCreate");
  }
  async run(client: DiscordClient) {
    console.log("Created channel");
  }
}
