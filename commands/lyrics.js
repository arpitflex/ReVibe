const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");
const {Lyrics} = require("@discord-player/extractor");

const lyricsClient = Lyrics.init();

const lyricsCommand = new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get lyrics of the current song!')
    .addStringOption((option) => option
        .setName('query')
        .setDescription('The song you want to find the lyrics for'));

module.exports = {
    data: lyricsCommand, async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        const currentTrack = queue.nowPlaying();
        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }
        if (!queue.playing) {
            return await interaction.reply({content: 'No music is currently being played', ephemeral: true});
        }

        const query = interaction.options.getString('query');

        await interaction.deferReply();

        const lyricsData = await lyricsClient.search(query ?? (currentTrack.searchQuery ?? currentTrack.title)).then();

        if (lyricsData) {
            const messages = [];
            let chunk = 0;
            messages[chunk] = ''
            const lyricsArray = lyricsData.lyrics.split('\n');
            for (let i = 0; i < lyricsArray.length; i++) {
                if (messages[chunk].length + lyricsArray[i].length < 4096) {
                    messages[chunk] = messages[chunk].concat(lyricsArray[i] + '\n');
                } else {
                    chunk++;
                    messages[chunk] = lyricsArray[i];
                }
            }
            for (let i = 0; i < messages.length; i++) {
                const lyricsEmbed = new MessageEmbed()
                    .setColor('#fbd75a')
                    .setTitle(`${lyricsData.artist.name} - ${lyricsData.title}`)
                    .setURL(lyricsData.url)
                    .setAuthor({
                        name: lyricsData.artist.name, iconURL: lyricsData.artist.image
                    })
                    .setDescription(messages[i])
                    .setThumbnail(lyricsData.thumbnail)
                    .setFooter({
                        text: `Part ${i + 1}/${messages.length}`
                    });
                await interaction.followUp({embeds: [lyricsEmbed]});
            }
            return;
        } else {
            return await interaction.followUp({content: `:interrobang: | **Lyrics for ${query ?? currentTrack.title} could not be found!**`});
        }
    }
}