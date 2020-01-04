import { Message, Client, MessageEmbed, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../main";
import { vars } from '../../assets/variables/help_vars';
import { mess } from '../../assets/messy_stuff/executeCode';
import ConfVars, { Variables } from '../../assets/mongoose/schemas/config_variables';
import Server, { GuildModel } from "../../assets/mongoose/schemas/Guild";
import Repeat, { IRepeat } from '../../assets/mongoose/schemas/RepeatMsg';

export default class config implements IBotCommand {

    readonly _commandKeyWords = ["config"];

    category: string = "util";

    help = "Configurate the bot for your own guild (server).";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = `::config [argument] ?[argument #2]? [value]`;

    adminOnly = true;

    devOnly = false;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const helpEmbed: MessageEmbed = new MessageEmbed()
            .setAuthor(message.member.displayName, message.author.displayAvatarURL())
            .setTitle("Config; Help")
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL())

        if (args[0].toLowerCase() === 'help') {

            for (let i = 0; i < Object.keys(vars).length; i++) {

                await helpEmbed.addField(Object.keys(vars)[i].toUpperCase(), `**Description**: ${Object.values(vars)[i].desc}, \n**Usage**: ${Object.values(vars)[i].usage}\n`)
            }

            message.channel.send(helpEmbed);
        }

        if (Object.keys(vars).some(v => args[0].toLowerCase() === v.toLowerCase())) {

            let newVar = Object.keys(vars).find(v => args[0].toLowerCase() === v.toLowerCase());

            let confVar = mess[newVar];

            confVar(Server, message, args, ConfVars, Repeat);
        }
    }
};