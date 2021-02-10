import { Message } from "discord.js";
import DiscordClient from "../../client/client";

/**
 * The default template for commands.
 *
 * @export BaseCommand
 * @abstract
 * @class BaseCommand
 */
export default abstract class BaseCommand {
  /**
   * Creates an instance of BaseCommand.
   * @param {string} name Name of command.
   * @param {string} category Category of command.
   * @param {Array<string>} aliases Different names that can call the command.
   * @memberof BaseCommand
   */
  constructor(
    private name: string,
    private category: string,
    private aliases: Array<string>
  ) {}

  getName(): string {
    return this.name;
  }
  getCategory(): string {
    return this.category;
  }
  getAliases(): Array<string> {
    return this.aliases;
  }

  /**
   * Default template for command functions.
   *
   * @abstract
   * @param {DiscordClient} client A discord client instance.
   * @param {Message} message The message that called the command.
   * @param {(Array<string> | null)} args The arguments after the function call.
   * @memberof BaseCommand
   */
  abstract run(
    client: DiscordClient,
    message: Message,
    args: Array<string> | null
  ): Promise<void>;
}
