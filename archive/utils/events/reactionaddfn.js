"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleReactionAdd = exports.addMemberRole = void 0;
const database_1 = require("../../database/database");
const addMemberRole = (emojiRoleMappings, reaction, user) => {
    if (emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
        let roleId = emojiRoleMappings[reaction.emoji.id];
        let role = reaction.message.guild.roles.cache.get(roleId);
        let member = reaction.message.guild.members.cache.get(user.id);
        if (role && member) {
            member.roles.add(role);
        }
    }
};
exports.addMemberRole = addMemberRole;
const roleReactionAdd = (client, reaction, user, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let msgDocument = yield database_1.DB.Models.RoleReactions.findOne({
            messageId: id,
        });
        if (msgDocument) {
            client.cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
            let { emojiRoleMappings } = msgDocument;
            exports.addMemberRole(emojiRoleMappings, reaction, user);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.roleReactionAdd = roleReactionAdd;
