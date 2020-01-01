import { Schema, model, Document, Model } from "mongoose";
import { Role, EmojiResolvable, RoleResolvable, Emoji, GuildEmoji, UserResolvable, Guild, GuildMemberResolvable, User } from "discord.js";

export interface RolesDB extends Document {
    category: {
        guild: string;
        name: string;
        roles: Array<{
            emote: EmojiResolvable | string;
            role: RoleResolvable | string;
            users?: string[];
        }>;
    }
}

const ReactRoles: Schema = new Schema({
    category: {
        type: Object,
        required: true
    }
});

export default model<RolesDB>("Role DB", ReactRoles);