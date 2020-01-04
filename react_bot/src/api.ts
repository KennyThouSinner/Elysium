import { Message, Client } from "discord.js";

export interface IBotCommand {
    _commandKeyWords: string[];
    category: string;
    help: string;
    isThisCommand(command: string): boolean;
    usage: string;
    adminOnly: boolean;
    devOnly: boolean;
    runCommand(args: string[], message: Message, client: Client): Promise<void>;
}