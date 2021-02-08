import { registerCommands, registerEvents } from "./utils/registry";
import config from "../config.json";
import DiscordClient from "./client/client";
import cron from "node-cron";
import { checkEventDB, checkRmdDB, checkTimerDB } from "./utils/TimerFunctions";
import { DB } from "./database/database";

const client = new DiscordClient({
  partials: ["MESSAGE", "REACTION", "USER", "CHANNEL", "GUILD_MEMBER"],
});

cron.schedule("30 * * * * *", async () => {
  // console.log("Running every minute");
  checkEventDB(client);
  checkRmdDB(client);
  checkTimerDB(client);
});

(async () => {
  client.prefix = config.prefix || client.prefix;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.login(config.token);
})();
