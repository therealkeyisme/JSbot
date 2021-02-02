import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client: DiscordClient) {
    let user: any = client.user;
    let tag = user.tag;
    console.log(`${tag} has logged in.`);
  }
}
