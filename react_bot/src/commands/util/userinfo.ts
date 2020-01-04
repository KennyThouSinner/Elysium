import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import Guild from "../../assets/mongoose/schemas/Guild";
import * as moment from 'moment';

export default class userinfo implements IBotCommand {

    readonly _commandKeyWords = ["userinfo", "ui", "info", "whois"];

    category: string = "util";

    help: string = "Shows detailed information about the specified User";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage: string = "::userinfo [@user]";

    adminOnly: boolean = false;

    devOnly: boolean = false;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const user = message.author || await client.users.fetch(message.mentions.users.size >= 1 ? message.mentions.users.first().id : message.content.toLowerCase().match(/[0-9]{17,18}/)[0]);

        let status = {
            "dnd": "Do not Disturb",
            "idle": "Idle",
            "offline": "Offline",
            "online": "Online",
        }

        let games = {
            "PLAYING": "Playing",
            "STREAMING": "Streaming",
            "LISTENING": "Listening to",
            "WATCHING": "Watching",
        }

        const embed = new MessageEmbed()
            .setTitle(`Information about ${user.tag}`)
            .addField("Account Created At", moment(user.createdTimestamp).format('LLL'), true)
            .addField("User Joined Guild At", moment((await message.guild.members.fetch(user)).joinedTimestamp).format('LLL'), true)
            .addField("User ID", user.id, true)
            .addField("User Username", user.username, true)
            .addField("User Discriminator", "#" + user.discriminator, true)
            .addField("User Tag", user.username + "\n #" + user.discriminator, true)
            .addField("Nitro Booster", (await message.guild.members.fetch(user)).premiumSince ? (await message.guild.members.fetch(user)).premiumSince : "False", true)
            .addField("Bot", user.bot ? "This user is a bot" : "This user is not a bot", true)
            .addField("Status", status[user.presence.status], true)
            .addField("Presence", user.presence.activity ? `${games[user.presence.activity.type] !== undefined ? "**" + games[user.presence.activity.type] + "**" : ""}` + " " + user.presence.activity.name : "This user isn't playing a game", true)
            .addField("Spotify", user.presence.activity ? user.presence.activity.name.toLowerCase() === "spotify" ? "**Song**: " + user.presence.activity.details + "\n**Artist(s)**: " + user.presence.activity.state.replace(/;/g, ', ') + "\n**Album**: " + user.presence.activity.assets.largeText : "This user isn't listening to spotify or the bot cannot recognize it since the mentioned user has another presence." : "This user is not using any presence", true)
            .setThumbnail(user.presence.activity ? user.presence.activity.name.toLowerCase() === "spotify" ? `https://i.scdn.co/image/${user.presence.activity.assets.largeImage.replace('spotify:', '')}` : user.displayAvatarURL() : user.displayAvatarURL())
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setTimestamp();

        message.channel.send(embed);
    }
}