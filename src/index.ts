import { registerCommands, registerEvents } from "./utils/registry";
import config from "../config.json";
import DiscordClient from "./client/client";
import { checkDBTimers } from "./utils/NewTimerFunctions";

/** @type {DiscordClient} */
const client = new DiscordClient({
  partials: ["MESSAGE", "REACTION", "USER", "CHANNEL", "GUILD_MEMBER"],
});

setInterval(checkDBTimers, 30000, client);

(async () => {
  client.prefix = config.prefix || client.prefix;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.login(config.token);
})();
