import { Message, Client, MessageEmbed, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../main";

export default class mute implements IBotCommand {

    readonly _commandKeyWords = ["mute"];

    help: string = "";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage: string = ``;

    adminOnly: boolean = true;

    devOnly: boolean = false;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

    }
};