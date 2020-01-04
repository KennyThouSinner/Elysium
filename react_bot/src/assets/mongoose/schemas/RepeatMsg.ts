import { Schema, model, Document, Model } from "mongoose";
import { UserResolvable, GuildResolvable } from "discord.js";

export interface IRepeat extends Document {
    category: string;
    guild: string;
    users: (UserResolvable | string)[];
}

const Repeat: Schema = new Schema({
    category: {
        type: String,
        required: true
    },
    guild: {
        type: String,
        required: true
    },
    users: {
        type: Object,
        required: true
    },
});

export default model<IRepeat>("Repeat", Repeat);