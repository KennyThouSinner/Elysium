import { Client, Message, User, MessageReaction, GuildMemberResolvable, UserResolvable } from "discord.js";
import { client, commands } from "../main";
import { config } from "../config";
import Server, { GuildModel } from "../assets/mongoose/schemas/Guild";
import { handleCommand } from "../functions/handleCommand";
import * as chalk from "chalk";
import ReactRoles, { RolesDB } from '../assets/mongoose/schemas/Roles';
import Roles from "../assets/mongoose/schemas/Roles";
import ConfVars, { Variables } from '../assets/mongoose/schemas/config_variables';
import Repeat, { IRepeat } from '../assets/mongoose/schemas/RepeatMsg';

export class superClient {

    Handler() {

        client.once("ready", async () => {

            console.log(chalk.green(`[DISCORD] (CLIENT) Logged in as ${client.user.tag}`));

            for (const [id, guild] of client.guilds) {
                const existing = await Server.findOne({ guild: id });
                if (!existing) {
                    new Server({
                        guild: id,
                        prefix: config.prefix
                    }).save();
                }
            }
        });

        client.on("message", async message => {

            if (message.author.bot) { return; }

            if (message.channel.type === "dm") { return; }

            let serv = await Server.findOne({
                guild: message.guild.id
            });

            let cv = await ConfVars.findOne({
                guild: message.guild.id
            });

            let repeat = await Repeat.findOne({
                users: message.author.id,
                guild: message.guild.id
            });

            if (!serv)
                await new Server({
                    guild: message.guild.id,
                    prefix: config.prefix
                }).save();

            if (!cv)
                await new ConfVars({
                    guild: message.guild.id,
                    rpc: false,
                    prefix: config.prefix,
                    modlog: {
                        exists: false
                    }
                }).save();

            if (repeat !== null && repeat.users.find(u => u === message.author.id)) message.channel.send(`${message.author}, ${message.content}`);

            if (!message.content.toLowerCase().startsWith(serv.prefix) || message.content.slice(serv.prefix.length).length <= 0) { return; }

            handleCommand(message as Message, serv.prefix as string);
        });

        client.on('messageReactionAdd', async (r: MessageReaction, user: User) => {

            if (r.message.partial) await r.message.fetch();

            if (r.message.guild.id !== '659399091750436904') return;

            let rr = await ReactRoles.findOne({ 'category.guild': r.message.guild.id, 'category.roles.emote': r.emoji.id });

            if (rr.category.roles.some(c => c.users.some(u => u !== user.id))) {

                rr.category.roles.find(c => c.emote === r.emoji).users.push(user.id);

                rr.markModified('category.roles');

                await rr.save();

                return (await r.message.guild.members.fetch(user.id)).roles.add(r.message.guild.roles.find(role => role.id === rr.category.roles.find(rol => rol.role === role).role));
            }

            if (rr.category.roles.find(c => c.emote === r.emoji).users.find(u => u === user.id) && (await ConfVars.findOne({ guild: r.message.guild.id })).rpc === true) return user.send(`You already have a role from this category, and the __RPC__ (Role per Category) option is turned on in this guild.`);
            else if (rr.category.roles.find(c => c.emote === r.emoji).users.find(u => u === user.id) && (await ConfVars.findOne({ guild: r.message.guild.id })).rpc !== true) return (await r.message.guild.members.fetch(user)).roles.add(r.message.guild.roles.find(role => role.id === rr.category.roles.find(rol => rol.emote === r.emoji).role)).then((member) => member.send(`Successfully added the role`));
        });

        client.on('messageReactionRemove', async (r: MessageReaction, user: User) => {

            if (r.message.partial) await r.message.fetch();

            if (r.message.guild.id !== '659399091750436904') return;

            let rr = await ReactRoles.findOne({ 'category.guild': r.message.guild.id, 'category.roles.emote': r.emoji.id });

            if (rr.category.roles.some(async cat => cat.users.find(u => u === user.id) === (await client.users.fetch(rr.category.roles.find(c => c.emote === r.emoji.id).users.find(u => u === user.id).toString().match(/[0-9]+/)[0])).id)) {

                (await r.message.guild.members.fetch(rr.category.roles.find(cat => cat.emote === r.emoji.id).users.find(u => u === user.id))).roles.remove(rr.category.roles.find(role => role.emote === r.emoji.id).role);

                rr.category.roles.splice(rr.category.roles.findIndex(cat => cat.users.find(u => u === user.id)), 1);

                rr.markModified('category.roles');

                await rr.save();
            }
        })

        client.login(config.token);

    }
}