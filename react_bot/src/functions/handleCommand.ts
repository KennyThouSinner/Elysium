import { Message } from "discord.js";
import { commands, client } from "../main";

export async function handleCommand(message: Message, pref: string) {

    let command = message.content.split(" ")[0].replace(pref.toLowerCase(), "").toLowerCase();
    let args = message.content.split(" ").slice(1);

    for (let i = 0; i < commands.length; i++) {

        try {
            if (!commands[i].isThisCommand(command)) {
                continue;
            }


            if (commands[i].adminOnly === true && !message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`You do not have the sufficient permission in order to execute this command.`);
            if (commands[i].devOnly === true && message.author.id !== "575108662457139201") return message.channel.send(`You do not have the sufficient permission in order to call this action.`)

            await commands[i].runCommand(args, message, client);
        } catch (e) {
            console.log(e);
        }
    }
}