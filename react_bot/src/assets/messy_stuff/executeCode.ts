import { Message } from "discord.js";
import { Schema } from "mongoose";
import { config } from "../../config";
import { IRepeat } from "../mongoose/schemas/RepeatMsg";
import { ILyrics } from "../mongoose/schemas/Lyrics";

export let mess = {

    rpc: async function rpc(Server, message: Message, args: string[], ConfVars) {

        const cv = await ConfVars.findOne({ guild: message.guild.id });

        const acceptedVars = {
            'true': true,
            'on': true,
            'off': false,
            'false': false
        };

        const accVar = Object.keys(acceptedVars).find(v => v === args[1].toLowerCase());

        if (!accVar) return message.channel.send(`Please look at the proper usage of the command.`)
        else if (accVar && cv.rpc === acceptedVars[args[1].toLowerCase()]) return message.channel.send(`The **rpc** option has already been turned ${cv.rpc === true ? "on" : "off"}`);
        else {
            cv.rpc = !cv.rpc;
            await cv.save();
            message.channel.send(`Successfully turned the **rpc** option __${cv.rpc === true ? "on" : "off"}__`);
        }
    },

    prefix: function prefix(Server, message: Message, args: string[], ConfVars) {

        Server.findOne({
            guild: message.guild.id
        }, async (err, g) => {
            if (err) throw err;

            if (args[1].toLowerCase() === 'set' && args[2].toLowerCase() === 'default') {
                if (!g) await new Server({
                    guild: message.guild.id,
                    prefix: config.prefix
                }).save().then(() => message.channel.send(`Successfully changed the guild's prefix back to the default; ${config.prefix}`));

                else {
                    g.prefix = config.prefix;
                    await g.save().then(() => message.channel.send(`Successfully changed the guild's prefix back to the default; ${config.prefix}`));
                }
            }

            else if (args[1].toLowerCase() === 'set') {
                if (!g) await new Server({
                    guild: message.guild.id,
                    prefix: args[2].toLowerCase()
                }).save().then(() => { message.channel.send(`Successfully changed the guild's prefix to ${g.prefix}`) });

                else {
                    g.prefix = args[2].toLowerCase();
                    await g.save().then(() => { message.channel.send(`Successfully changed the guild's prefix to ${g.prefix}`) });
                }
            } else if (args[1] === 'set' && !args[2]) {
                message.channel.send(`Please provide the **prefix** value.`);
            } else if (!args[1]) {
                message.channel.send(`Please use the 'set' argument.`);
            }
        })
    },

    modlog: function modlog(Server, message: Message, args: string[], ConfVars) {

        if (!args.length) return message.channel.send(`Provide some arguments for this action, please.`);

        const channel = message.content.match(/[0-9]{17,18}/) ? message.guild.channels.find(c => c.id === message.content.match(/[0-9]{17,18}/)[0]) : message.mentions.channels.first() || undefined;

        ConfVars.findOne({
            guild: message.guild.id
        }, async (err, cv) => {
            if (err) throw err;

            if (!cv && args[1].toLowerCase() === 'save') await new Server({
                guild: message.guild.id,
                prefix: config.prefix,
                modlog: {
                    exists: true,
                    id: channel.id
                }
            }).save().then(() => message.channel.send(`Successfully added ${channel} as the mod-log channel in this guild.`));

            else if (args[1].toLowerCase() === 'save') {
                cv.modlog = { exists: true, id: channel.id };
                await cv.save().then(() => message.channel.send(`Successfully added ${channel} as the mod-log channel in this guild.`));
            }

            else if (args[1].toLowerCase() === 'remove') {
                cv.modlog = { exists: false };
                await cv.save().then(() => message.channel.send(`Successfully removed the 'modlog' configuration from my database for this guild.`));
            }
        })
    },

    repeat: async function repeat(Server, message: Message, args: string[], ConfVars, Repeat) {

        if (!["575108662457139201", "646111749543821312"].some(i => i === message.author.id)) return message.channel.send(`You must be a developer in order to configurate this!`);

        const user =
            await message.client.users.fetch(
                message.mentions.users.size >= 1
                    ? message.mentions.users.first().id
                    : message.content.toLowerCase().match(/([0-9]+)|((?<=user=('|"))[0-9\s*\?]+(?!='|"))/)[0]
            );

        const repeat = await Repeat.findOne({ category: message.content.toLowerCase().match(/(?<=(cat|category)=('|"))[0-9A-Za-z\s*\?]+(?!='|")/)[0] });

        if (!args.length) return message.channel.send(`Please provide some arguments.`);
        if (!user) return message.channel.send(`Please provide the user.`);
        if (!message.content.toLowerCase().match(/(?<=(cat|category)=('|"))[0-9A-Za-z\s*\?]+('|")/)) return message.channel.send(`Please provide the 'category' argument.`);
        if (!['add', 'save', 'sum', '+', 'new', 'create', '*', 'remove', '-'].some(e => args[1].toLowerCase() === e)) return message.channel.send(`Please provide one of the following actions: \n\n**${['add', 'save', 'sum', '+', 'new', 'create', '*', 'remove', '-'].join(",\n")}**`);
        if (['new', 'create', '*'].some(n => args[1].toLowerCase() === n) && repeat !== null) return message.channel.send(`That category already exists.`);
        if (['add', 'save', 'sum', '+'].some(e => args[1].toLowerCase() === e) && repeat.users.find(u => u.user === user.id)) return message.channel.send(`That user is already in this category.`);
        if (['remove', '-'].some(r => args[1].toLowerCase() === r) && repeat.users.find(u => u.user === user.id) === undefined) return message.channel.send(`I couldn't find that user.`)

        if (['add', 'save', 'sum', '+'].some(e => args[1].toLowerCase() === e)) {

            Repeat.findOne({
                category: message.content.toLowerCase().match(/(?<=(cat|category)=('|"))[0-9A-Za-z\s*\?]+(?!='|")/)[0],
                guild: message.guild.id
            }, async (err, r) => {

                if (err) throw err;

                if (!r || r == null) return message.channel.send(`Sorry, but I couldn't find that category.`);

                r.users.push(user.id)

                r.markModified('users');

                await r.save()
                    .then((info) => message.channel.send(`Successfully added ${user} to the 'repeat' DB.`));
            })
        }
        else if (['new', 'create', '*'].some(n => args[1].toLowerCase() === n)) {

            return await new Repeat({
                category: message.content.toLowerCase().match(/(?<=(cat|category)=('|"))[0-9A-Za-z\s*\?]+(?!='|")/)[0],
                guild: message.guild.id,
                users: [
                    user.id
                ]
            }).save().then((info) => message.channel.send(`Successfully created a new 'repeat' which includes ${user}; under the category name **${info.category}**`));
        }
        else if (['remove', '-'].some(r => args[1].toLowerCase() === r)) {

            Repeat.findOne({
                category: message.content.toLowerCase().match(/(?<=(cat|category)=('|"))[0-9A-Za-z\s*\?]+(?!='|")/)[0],
                guild: message.guild.id
            }, async (err, r) => {

                if (err) throw err;

                if (!r || r == null) return message.channel.send(`Sorry, but I couldn't find that category.`);

                r.users.splice(r.users.findIndex(i => i.user === user.id), 1);

                r.markModified('users');

                await r.save()
                    .then((info) => message.channel.send(`Successfully removed ${user} from the 'repeat' DB under the category **${info.category}**`));
            })
        }
    }
}