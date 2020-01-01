import { Schema, model, Document, Model } from "mongoose";
import { Guild } from "discord.js";

export interface Variables extends Document {
    guild: string;
    rpc: boolean;
    prefix: string;
    modlog: {
        exists: boolean;
        id?: string;
    };
}

const ConfVars: Schema = new Schema({

    guild: {
        type: String,
        required: true
    },
    rpc: {
        type: Boolean,
        required: false
    },
    prefix: {
        type: String,
        required: false
    },
    modlog: {
        type: Object,
        required: false
    }
});

export default model<Variables>("Configuration Variables", ConfVars);