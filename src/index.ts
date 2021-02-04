import { registerCommands, registerEvents } from "./utils/registry";
import config from "../config.json";
import DiscordClient from "./client/client";
import cron from "node-cron";
import { checkEventDB } from "./utils/TimerFunctions";

const client = new DiscordClient({
  partials: ["MESSAGE", "REACTION", "USER", "CHANNEL", "GUILD_MEMBER"],
});

cron.schedule("* * * * *", async () => {
  console.log("Running every minute");
  checkEventDB(client);
});

(async () => {
  client.prefix = config.prefix || client.prefix;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.login(config.token);
})();
