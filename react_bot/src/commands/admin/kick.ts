import { Message, Client, MessageEmbed, GuildMember, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { parse } from "path";
import { Collection } from "mongoose";
import ConfVars, { Variables } from '../../assets/mongoose/schemas/config_variables';

export default class kick implements IBotCommand {

    readonly _commandKeyWords = ["kick"];

    help = "Kicks the mentioned member from the guild (server).";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = "::kick [@member] reason='[reason]'";

    adminOnly = true;

    devOnly = false;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const cv = await ConfVars.findOne({ guild: message.guild.id });

        if (!args.length) return message.channel.send(`Please provide a Member's ID or mention a Member.`).catch(e => null);

        const member = await message.guild.members.fetch(message.mentions.users.size >= 1 ? message.mentions.users.first() : message.content.toLowerCase().match(/[0-9]{17,18}/)[0]);

        if (!member) return message.channel.send(`Unable to retrieve the provided member.`).catch(e => null);

        const reason = message.content.match(/(?<=reason=')[a-zA-Z0-9]+/) ? message.content.match(/(?<=reason=')[a-zA-Z0-9\s]*/)[0] : "No reason specified";

        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(`You cannot kick someone with the same or higher role than you.`).catch(e => null);

        if (message.guild.me.roles.highest.position <= member.roles.highest.position) return message.channel.send(`Sorry, but I cannot kick someone with the same or higher role than mine.`).catch(e => null);

        const kickEmbed: MessageEmbed = new MessageEmbed()
            .setTitle(`Kick went through successfully.`)
            .setAuthor(`Kicked: ${member.displayName}`, member.user.displayAvatarURL())
            .addField(`REASON`, reason)
            .setFooter(`Kicked by ${message.member.displayName}`, message.author.displayAvatarURL())
            .setTimestamp();

        member.kick()
            .then(async (member) => {
                message.channel.send(kickEmbed);
                if (cv.modlog.exists === true && message.guild.channels.get(cv.modlog.id)) await (message.guild.channels.get(cv.modlog.id) as TextChannel).send(kickEmbed)
            })
            .catch((err) => {
                console.error(err);
                message.channel.send(`Woops, something went wrong. I could not kick ${member} successfully.`);
            })
    }
}