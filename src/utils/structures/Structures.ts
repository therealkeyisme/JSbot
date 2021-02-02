import { DMChannel, NewsChannel, TextChannel, VoiceChannel } from "discord.js";
import { type } from "os";

export interface SongType {
  id: string;
  title: string;
  url: string;
}

export interface QueueType {
  textChannel: TextChannel | DMChannel | NewsChannel;
  voiceChannel: VoiceChannel;
  connection: any;
  songs: Array<SongType>;
  volume: number;
  playing: boolean;
}

export interface ShopObject {
  guildId: string;
  shoppinglist: Array<string>;
  lastShopList?: string;
}
