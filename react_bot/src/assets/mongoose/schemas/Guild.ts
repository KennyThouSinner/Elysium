import { Schema, model, Document, Model } from "mongoose";
import { config } from "../../../config";

export interface GuildModel extends Document {
    guild: string;
    prefix?: string;
};

const Server: Schema = new Schema({
    guild: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        default: config.prefix,
        required: false
    }
});

export default model<GuildModel>("Server", Server);