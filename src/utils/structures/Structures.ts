import { DMChannel, NewsChannel, TextChannel, VoiceChannel } from "discord.js";
import { type } from "os";

/**
 * The object type for song requests
 *
 * @export Songtype
 * @interface SongType
 */
export interface SongType {
  id: string;
  title: string;
  url: string;
}

/**
 * The object type for the client queue
 *
 * @export QueueType
 * @interface QueueType
 */
export interface QueueType {
  textChannel: TextChannel | DMChannel | NewsChannel;
  voiceChannel: VoiceChannel;
  connection: any;
  songs: Array<SongType>;
  volume: number;
  playing: boolean;
}

/**
 * The type of obejcts for shopping lists
 *
 * @export ShopObject
 * @interface ShopObject
 */
export interface ShopObject {
  guildId: string;
  shoppinglist: Array<string>;
  lastShopList?: string;
}
