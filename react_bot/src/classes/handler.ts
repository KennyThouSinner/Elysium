import { commands } from '../main';
import { Message, MessageEmbed } from 'discord.js';
import { MessageEmbedPageHandler } from '../embedPageHandler';
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
                .setTitle("List of all the commands");

            let sent = (await this.message.channel.send(embed)) as Message;

            if (Array.isArray(this.message)) {
                this.message = this.message[0];
            }

            let itemHandler = (embed: MessageEmbed, data: Array<IBotCommand>) => {
                data.forEach(item => {
                    embed.addField(`${item._commandKeyWords[0][0].toUpperCase() + item._commandKeyWords[0].slice(1)}`, `${item.help} \n**Usage**: ${item.usage}`);
                })
                return embed;
            }

            let handler = new MessageEmbedPageHandler<IBotCommand>(commands, 5, itemHandler, embed, sent)

            return handler.startCollecting(this.message.author.id, sent);

        } else {
            const foundCmd = commands.find(arr => arr._commandKeyWords[0].toLowerCase() === this.message.content.split(" ").slice(1)[0].toLowerCase()) || commands.find(arr => arr._commandKeyWords.slice(1).some(r => r.toLowerCase() === this.message.content.split(" ").slice(1)[0].toLowerCase()));
            if (!foundCmd) return this.message.channel.send("I couldn't find that command, sorry!");
            else return this.message.channel.send(`**Command**: \`\`${foundCmd._commandKeyWords[0].toUpperCase() + foundCmd._commandKeyWords[0][0].slice(1)}\`\`, \n**Aliases**: ${foundCmd._commandKeyWords.slice(1).length >= 1 ? foundCmd._commandKeyWords.slice(1).map(x => ` \`\`${x}\`\``).join(',') : "No aliases for this command!"}, \n**Usage**: \`\`${foundCmd.usage}\`\``);
        }
    }
}