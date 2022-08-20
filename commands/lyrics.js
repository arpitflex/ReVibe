const {ApplicationCommandOptionType} = require("discord.js");
const {Lyrics} = require("@discord-player/extractor");
const ytly = require('ytly');

const lyricsClient = Lyrics.init();

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
    data: {
        name: 'lyrics',
        description: 'Get lyrics of the current song! Songs from Spotify are more reliable.',
        options: [
            {
                name: 'query',
                description: 'The song you want to find the lyrics for',
                type: ApplicationCommandOptionType.String
            }
        ],
        voiceChannel: true
    },
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
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
                const lyricsEmbed = {
                    color: 0xfbd75a,
                    title: `${lyricsData.artist.name} - ${lyricsData.title}`,
                    url: lyricsData.url,
                    author: {
                        name: lyricsData.artist.name,
                        icon_url: lyricsData.artist.image
                    },
                    description: messages[i],
                    thumbnail: lyricsData.thumbnail,
                    footer: {
                        text: `Part ${i + 1}/${messages.length}`
                    }
                };

                await interaction.followUp({embeds: [lyricsEmbed]});
            }
            return;
        } else {
            const lyrics = await ytly.get.lyrics(currentTrack.url);

            if (lyrics) {
                const messages = divideLyricsIntoMessages(lyrics.split('\n'));
                for (let i = 0; i < messages.length; i++) {
                    const lyricsEmbed = {
                        color: 0xfbd75a,
                        title: currentTrack.title,
                        url: currentTrack.url,
                        author: {
                            name: currentTrack.author
                        },
                        description: messages[i],
                        thumbnail: currentTrack.thumbnail,
                        footer: {
                            text: `Part ${i + 1}/${messages.length}`
                        }
                    };

                    await interaction.followUp({embeds: [lyricsEmbed]});
                }
                return;
            }
        }

        return await interaction.followUp({
            content: `:thought_balloon: | Lyrics for **${lyricsSearch}** could not be found!`,
            ephemeral: true
        });
    }
}