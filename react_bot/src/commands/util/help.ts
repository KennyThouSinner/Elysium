import { Message, Client, MessageEmbed, TextChannel } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../main";
import { handler } from "../../classes/handler";

export default class help implements IBotCommand {

    readonly _commandKeyWords = ["help", "commands"];

    help = "Sends a scrollable embed which explains all the bot's commands";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = `::help`;

    adminOnly = false;

    devOnly = false;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        (new handler(message, args)).helpRespond();
    }
};