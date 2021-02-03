import { MessageReaction, User } from "discord.js";
import DiscordClient from "../../client/client";
import { DB } from "../../database/database";
import BaseEvent from "../../utils/structures/BaseEvent";

export default class MessageReactionAdd extends BaseEvent {
  constructor() {
    super("messageReactionAdd");
  }

  async run(client: DiscordClient, reaction: MessageReaction, user: User) {
    const addMemberRole = (
      emojiRoleMappings: any,
      reaction: MessageReaction,
      user: User
    ): void => {
      if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
        let roleId = emojiRoleMappings[reaction.emoji.id];
        let role = reaction.message.guild.roles.cache.get(roleId);
        let member = reaction.message.guild.members.cache.get(user.id);
        if (role && member) {
          member.roles.add(role);
        }
      }
    };

    const roleReactionAdd = async (
      client: DiscordClient,
      reaction: MessageReaction,
      user: User,
      id: string
    ) => {
      let rxnDocument = await DB.Models.RoleReactions.findOne({
        messageId: id,
      });
      if (rxnDocument) {
        client.cachedMessageReactions.set(id, rxnDocument.emojiRoleMappings);
        let emojiRoleMappings = rxnDocument.emojiRoleMappings;
        addMemberRole(emojiRoleMappings, reaction, user);
      }
    };
    try {
      if (reaction.message.guild.members.cache.get(user.id).user.bot) return;

      let id = reaction.message.id;
      let emojiName = await reaction.emoji.name;
      let reactionMessage = await reaction.message.fetch();
      await roleReactionAdd(client, reaction, user, id);
    } catch (err) {
      console.log(err);
    }
  }
}
