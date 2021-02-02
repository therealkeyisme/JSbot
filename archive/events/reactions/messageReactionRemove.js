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
const reactionremovefn_1 = require("../../utils/events/reactionremovefn");
module.exports = (client, reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (reaction.message.guild.members.cache.get(user.id).user.bot) {
        return;
    }
    yield reaction.message.fetch;
    let { id } = reaction.message;
    yield reactionremovefn_1.roleReactionRemove(client, reaction, user, id);
});
