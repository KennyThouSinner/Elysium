import { Message, Client, MessageEmbed, GuildMember, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { parse } from "path";
import { Collection } from "mongoose";
import ConfVars, { Variables } from '../../assets/mongoose/schemas/config_variables';

export default class ban implements IBotCommand {

    readonly _commandKeyWords = ["ban"];

    category: string = "admin";

    help = "Bans the mentioned member from the guild (server).";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = "::ban [@member] reason='[reason]'";

    adminOnly = true;

    devOnly = false;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const cv = await ConfVars.findOne({ guild: message.guild.id });

        if (!args.length) return message.channel.send(`Please provide a Member's ID or mention a Member.`).catch(e => null);

        const member = await message.guild.members.fetch(message.mentions.users.size >= 1 ? message.mentions.users.first() : message.content.toLowerCase().match(/[0-9]{17,18}/)[0] || message.guild.members.find(m => m.displayName.includes(args[0].toLowerCase()) || m.user.username.includes(args[0].toLowerCase())));

        if (!member) return message.channel.send(`Unable to retrieve the provided member.`).catch(e => null);

        const reason = message.content.match(/(?<=reason=')[a-zA-Z0-9]+/) ? message.content.match(/(?<=reason=')[a-zA-Z0-9\s]*/)[0] : "No reason specified";

        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(`You cannot ban someone with the same or higher role than you.`).catch(e => null);

        if (message.guild.me.roles.highest.position <= member.roles.highest.position) return message.channel.send(`Sorry, but I cannot ban someone with the same or higher role than mine.`).catch(e => null);

        const banEmbed: MessageEmbed = new MessageEmbed()
            .setTitle(`Ban went through successfully.`)
            .setAuthor(`Banned: ${member.displayName}`, member.user.displayAvatarURL())
            .addField(`REASON`, reason)
            .setFooter(`Banned by ${message.member.displayName}`, message.author.displayAvatarURL())
            .setTimestamp();

        message.guild.members.ban((await client.users.fetch(member.id)), { days: 7, reason: reason })
            .then(async (member) => {
                message.channel.send(banEmbed);
                if (cv.modlog.exists === true && message.guild.channels.get(cv.modlog.id)) await (message.guild.channels.get(cv.modlog.id) as TextChannel).send(banEmbed)
            })
            .catch((err) => {
                console.error(err);
                message.channel.send(`Woops, something went wrong. I could not ban ${member} successfully.`);
            })
    }
}