import { Schema, model, Document, Model } from "mongoose";
import { Message } from "discord.js";

export interface ILyrics extends Document {
    song?: string;
    lyrics: {
        verses: {
            verse: number | string;
            lyric: Message | string;
        }[];
    };
}

const Lyrics: Schema = new Schema({
    song: {
        type: String,
        required: false
    },
    lyrics: {
        type: Object,
        required: true
    }
});

export default model<ILyrics>("Lyrics", Lyrics);