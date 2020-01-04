import { Message, Client, MessageEmbed, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../main";

export default class quote implements IBotCommand {

    readonly _commandKeyWords = ["quote"];

    category: string = "util";

    help = "Something only my developer can use!";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = `::quote [argument]`;

    adminOnly = false;

    devOnly = true;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        message.channel.send(args.join(" "));

    }
};