import { Message, Client, MessageEmbed, TextChannel, Emoji, Role } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../main";
import ReactRoles, { RolesDB } from '../../assets/mongoose/schemas/Roles';

export default class roles implements IBotCommand {

    readonly _commandKeyWords = ["roles"];

    help = "Set up roles, add new roles to a category, create new categories.";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = `**__[STILL A WORK IN PROGRESS]__**`;

    adminOnly = true;

    devOnly = false;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const validArgs = ["new", "add"];
        const validType = ["emote", "role"];

        if (!args.length) return message.channel.send(`Please provide some arguments.`).catch(e => null);
        else if (!validArgs.includes(args[0])) return message.channel.send(`Please provide a valid argument. \nValid arguments: \n**\`\`${validArgs.join("\n")}\`\`**`).catch(e => null)
        else if (!message.content.toLowerCase().includes(validType[0])) return message.channel.send(`Please provide a 'emote' type and it's value.`).catch(e => null);
        else if (!message.content.toLowerCase().includes(validType[1])) return message.channel.send(`Please provide a 'role' type and it's value.`).catch(e => null);
        else if (!args[1]) return message.channel.send(`Please provide a value to add to your argument.`).catch(e => null);

        if (args[0].toLowerCase() === 'add') {


            ReactRoles.findOne({

                'category.guild': message.guild.id,
                'category.name': args[1].toLowerCase()

            }, async (err, react) => {

                if (err) throw err;

                if (!react) return message.channel.send(`Sorry, but I couldn't find any category under the name you provided.`);

                if (react.category.roles.find(role => role.role === message.content.toLowerCase().match(/(?<=role=')[0-9]+/)[0])
                    &&
                    react.category.roles.find(role => role.emote === message.content.toLowerCase().match(/(?<=emote=')[0-9]+/)[0])) return message.channel.send(`That role has already been added under that emote.`)
                else {

                    react.category.roles = [
                        react.category.roles[0], {
                            emote: message.content.toLowerCase().match(/(?<=emote=')[0-9]+/)[0],
                            role: message.content.toLowerCase().match(/(?<=role=')[0-9]+/)[0]
                        }];

                    react.save().then((info) => {
                        message.channel.send(`Successfully pushed new values into the category **${info.category.name}**. \n**__Information__**: \n${info.category.roles.map(x => `\n**Emote**: ${message.guild.emojis.find(e => x.emote === e.id)} \n**Role**: ${message.guild.roles.find(r => x.role === r.id)}`)}\n`)
                    }).catch(err => { throw err });
                }
            });
        }

        else if (args[0].toLowerCase() === 'new') {

            if ((await ReactRoles.findOne({ 'category.guild': message.guild.id, 'category.name': args[1].toLowerCase() })) !== null) {
                return message.channel.send(`That category already exists.`).catch(e => null);
            }

            else {
                await new ReactRoles({
                    category: {
                        guild: message.guild.id,
                        name: args[1].toLowerCase(),
                        roles: [{
                            emote: message.content.toLowerCase().match(/(?<=emote=')[0-9]+/)[0],
                            role: message.content.toLowerCase().match(/(?<=role=')[0-9]+/)[0]
                        }]
                    }
                }).save().then((info) => {
                    message.channel.send(`Successfully created a new ReactRoles category under the name **${info.category.name}**. \n**__Information__**: \n${info.category.roles.map(x => `\n**Emote**: ${message.guild.emojis.find(e => x.emote === e.id)} \n**Role**: ${message.guild.roles.find(r => x.role === r.id)}`)}\n`);
                })
            }
        }
    }
};