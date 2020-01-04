import { Message, Client, MessageEmbed, TextChannel, MessageCollector } from "discord.js";
import { IBotCommand } from "../../api";
import { commands } from "../../main";
import Lyrics, { ILyrics } from '../../assets/mongoose/schemas/Lyrics';

export default class lyrics implements IBotCommand {

    readonly _commandKeyWords = ["lyrics", "lyric", "song"];

    category: string = "util";

    help = "Something only my developer can use!";

    isThisCommand(command: string): boolean {
        return this._commandKeyWords.some(arr => command.toLowerCase() === arr)
    };

    usage = `::lyrics [action] song='[arg]' lyrics='[arg #2]'`;

    adminOnly = false;

    devOnly = true;

    async runCommand(args: string[], message: Message, client: Client): Promise<void> {

        const song = message.content.toLowerCase().match(/(?<=song=('|")(`{2,3})?)[0-9A-Za-z\s*\?]+(?<!('|")(`{2,3})?)/)[0];
        const lyrics = message.content.toLowerCase().match(/(?<=lyrics=('|")(`{2,3})?)[0-9A-Za-z\s*\?]+(?<!('|")(`{2,3})?)/)[0];
        const collector = new MessageCollector(message.channel, (m: Message) => m.author.id === message.author.id);
        let i = 1;

        await new Lyrics({
            song: song,
            lyrics: {
                verses: [{
                    verse: i,
                    lyric: lyrics
                }]
            }
        }).save();

        message.channel.send(`Anymore verses to add? If so, just send the verse, otherwise, respond with 'no' or 'n'.`)
            .then(async (msg: Message) => {

                collector.on('collect', async (m: Message) => {

                    Lyrics.findOne({

                        song: song

                    }, async (err, l) => {

                        if (err) throw err;

                        if (!['n', 'no'].some(n => m.content.toLowerCase() == n)) {
                            await l.lyrics.verses.push({
                                verse: i + 1,
                                lyric: m
                            })

                            await l.markModified('lyrics.verses');

                            await l.save()
                                .then(async (info) => { await info.save(); message.channel.send(`Successfully pushed lyric into DB. \n\nInformation: **Verse**: ${info.lyrics.verses.find(r => r.verse == i + 1).verse}, \n**Lyric**: \`\`\`${info.lyrics.verses.find(r => r.verse == i + 1).lyric}\`\`\``) });

                            i++;
                        } else {
                            await collector.stop();
                        }
                    })
                })
            })
    }
};