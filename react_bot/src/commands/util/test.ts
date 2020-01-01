import { Message, Client, MessageEmbed, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../main";

export default class test implements IBotCommand {

    readonly _commandKeyWords = ["test"];

    help = "";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = ``;

    adminOnly = false;

    devOnly = true;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

    }
};