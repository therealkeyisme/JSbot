import DiscordClient from "../../client/client";

/**
 * Creates the Event template
 *
 * @export BaseEvent
 * @abstract
 * @class BaseEvent
 */
export default abstract class BaseEvent {
  /**
   * Creates an instance of BaseEvent.
   * @param {string} name Name of the event.
   * @memberof BaseEvent
   */
  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }
  /**
   * Template for event function
   *
   * @abstract
   * @param {DiscordClient} client The discord client instance
   * @param {...any} args Any argument an event has access to
   * @memberof BaseEvent
   */
  abstract run(client: DiscordClient, ...args: any): void;
}
