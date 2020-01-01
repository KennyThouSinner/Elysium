import { Schema, model, Document, Model } from "mongoose";
import { Role } from "discord.js";

export interface MuteDB extends Document {
    guild: string;
    member: string;
    roles: Role[];
}

const MuteRoles: Schema = new Schema({

    guild: {
        type: String,
        required: true
    },
    member: {
        type: String,
        required: true
    },
    roles: {
        type: Array,
        required: false
    }
});

export default model<MuteDB>("Mute DB", MuteRoles);