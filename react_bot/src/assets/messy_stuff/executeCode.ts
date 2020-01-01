import { Message } from "discord.js";
import { Schema } from "mongoose";
import { config } from "../../config";

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
    }
}