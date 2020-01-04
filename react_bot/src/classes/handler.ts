import { commands } from '../main';
import { Message, MessageEmbed, ReactionCollector, MessageReaction, User } from 'discord.js';
import { IBotCommand } from '../api';

export class handler {
    message: Message;
    args: string[];

    /** 
     * @param {Message} message 
     * @param {string[]} args 
     */

    constructor(message, args) {
        this.message = message;
        this.args = args;
    }

    public helpRespond = async () => {

        if (!this.message.content.split(" ").slice(1)[0]) {


            let embed = new MessageEmbed()
                .setTitle("Commands")
                .setDescription(`**CATEGORIES**: \n⚒️ - **ADMINISTRATION** \n🛡️ - **MODERATION** \n👀 - **REACTION** \n⚙️ - **UTILITY**`);

            let sent = (await this.message.channel.send(embed)) as Message;

            ['⚒️', '🛡️', '👀', '⚙️', '❌'].forEach((e) => sent.react(e));

            let rc = sent.createReactionCollector(
                (r: MessageReaction, u: User) => ['⚒️', '🛡️', '👀', '⚙️', '❌'].some(e => r.emoji.name === e) && u.id === this.message.author.id
            );

            rc.on('collect', async (r: MessageReaction, u: User) => {

                const adminEmbed = new MessageEmbed();
                const modEmbed = new MessageEmbed();
                const reactEmbed = new MessageEmbed();
                const utilEmbed = new MessageEmbed();

                let admin = () => {
                    commands.filter(i => i.category == 'admin').forEach((a) => adminEmbed.setTitle('ADMINISTRATION').addField(a._commandKeyWords[0].toUpperCase() + a._commandKeyWords[0][0].slice(1), `**Help**: ${a.help} \n**Usage**: ${a.usage}`))
                };
                let mod = () => {
                    commands.filter(i => i.category == 'mod').forEach((a) => modEmbed.setTitle('MODERATION').addField(a._commandKeyWords[0].toUpperCase() + a._commandKeyWords[0][0].slice(1), `**Help**: ${a.help} \n**Usage**: ${a.usage}`))
                };
                let react = () => {
                    commands.filter(i => i.category == 'react').forEach((a) => reactEmbed.setTitle('REACTION').addField(a._commandKeyWords[0].toUpperCase() + a._commandKeyWords[0][0].slice(1), `**Help**: ${a.help} \n**Usage**: ${a.usage}`))
                };
                let util = () => {
                    commands.filter(i => i.category == 'util').forEach((a) => utilEmbed.setTitle('UTILITY').addField(a._commandKeyWords[0].toUpperCase() + a._commandKeyWords[0][0].slice(1), `**Help**: ${a.help} \n**Usage**: ${a.usage}`));
                }

                if (r.emoji.name == '⚒️') { admin(); sent.reactions.delete(this.message.author.id); return sent.edit(adminEmbed) };
                if (r.emoji.name == '🛡️') { mod(); sent.reactions.delete(this.message.author.id); return sent.edit(modEmbed) };
                if (r.emoji.name == '👀') { react(); sent.reactions.delete(this.message.author.id); return sent.edit(reactEmbed) };
                if (r.emoji.name == '⚙️') { util(); sent.reactions.delete(this.message.author.id); return sent.edit(utilEmbed) };
                if (r.emoji.name == '❌') { await sent.delete(); rc.stop() };
            });

        } else {
            const foundCmd = commands.find(arr => arr._commandKeyWords[0].toLowerCase() === this.message.content.split(" ").slice(1)[0].toLowerCase()) || commands.find(arr => arr._commandKeyWords.slice(1).some(r => r.toLowerCase() === this.message.content.split(" ").slice(1)[0].toLowerCase()));
            if (!foundCmd) return this.message.channel.send("I couldn't find that command, sorry!");
            else return this.message.channel.send(`**Command**: \`\`${foundCmd._commandKeyWords[0].toUpperCase() + foundCmd._commandKeyWords[0][0].slice(1)}\`\`, \n**Aliases**: ${foundCmd._commandKeyWords.slice(1).length >= 1 ? foundCmd._commandKeyWords.slice(1).map(x => ` \`\`${x}\`\``).join(',') : "No aliases for this command!"}, \n**Usage**: \`\`${foundCmd.usage}\`\``);
        }
    }
}