import { Message, Client, MessageEmbed, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../main";

export default class test implements IBotCommand {

    readonly _commandKeyWords = ["test"];

    category: string = "util";

    help = "Something only my developer can use!";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = `::test`;

    adminOnly = false;

    devOnly = true;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        (message.guild.channels.get('659620465681367050') as TextChannel).send(`${await message.guild.members.fetch('579772996210655242')}, you make me so happy, I literally cant explain it. You make me smile more than anyone has ever managed to, and I wish I could just hug yougggggggggggggggggtfrhygjfmken, I'm really bad at putting things into words, sorry.`)

    }
};