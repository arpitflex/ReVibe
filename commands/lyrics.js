const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");
const {Lyrics} = require("@discord-player/extractor");
const ytly = require('ytly');

const lyricsClient = Lyrics.init();

const lyricsCommand = new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get lyrics of the current song! Songs from Spotify are more reliable.')
    .addStringOption((option) => option
        .setName('query')
        .setDescription('The song you want to find the lyrics for'));

function divideLyricsIntoMessages(lyricsArray) {
    const messages = [];
    let chunk = 0;
    messages[chunk] = ''
    for (let i = 0; i < lyricsArray.length; i++) {
        if (messages[chunk].length + lyricsArray[i].length < 4096) {
            messages[chunk] = messages[chunk].concat(lyricsArray[i] + '\n');
        } else {
            chunk++;
            messages[chunk] = lyricsArray[i];
        }
    }
    return messages;
}

module.exports = {
    data: lyricsCommand, async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }
        if (!queue.playing) {
            return await interaction.reply({content: 'No music is currently being played', ephemeral: true});
        }

        const currentTrack = queue.nowPlaying();
        const query = interaction.options.getString('query');

        await interaction.deferReply();

        const lyricsSearch = query ?? (currentTrack.searchQuery ?? (currentTrack.url.includes('spotify') ? `${currentTrack.title} ${currentTrack.author}` : currentTrack.title));
        const lyricsData = await lyricsClient.search(lyricsSearch).then();

        if (lyricsData) {
            const messages = divideLyricsIntoMessages(lyricsData.lyrics.split('\n'))
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
            const lyrics = await ytly.get.lyrics(currentTrack.url);

            if (lyrics) {
                const messages = divideLyricsIntoMessages(lyrics.split('\n'));
                for (let i = 0; i < messages.length; i++) {
                    const lyricsEmbed = new MessageEmbed()
                        .setColor('#fbd75a')
                        .setTitle(currentTrack.title)
                        .setURL(currentTrack.url)
                        .setAuthor({
                            name: currentTrack.author
                        })
                        .setDescription(messages[i])
                        .setThumbnail(currentTrack.thumbnail)
                        .setFooter({
                            text: `Part ${i + 1}/${messages.length}`
                        });
                    await interaction.followUp({embeds: [lyricsEmbed]});
                }
                return;
            }
        }

        return await interaction.followUp({content: `:thought_balloon: | Lyrics for **${lyricsSearch}** could not be found!`, ephemeral: true});
    }
}