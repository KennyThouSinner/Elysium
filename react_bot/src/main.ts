import { IBotCommand } from './api';
import * as mongoose from 'mongoose';
import { loader } from './classes/loader';
import { Client } from 'discord.js';
import { superClient } from './classes/client';
import { config } from './config';

mongoose.connect("mongodb://localhost:27017/STYX", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`[MONGODB] Successfully connected.`));

export let commands: IBotCommand[] = [];

export const client: Client = new Client();

export const sClient = new superClient()

export const loadr: loader = new loader();

sClient.Handler();

loadr.loadCmds(`${__dirname}/commands`);
