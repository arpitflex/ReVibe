const {QueryType} = require('discord-player');
const {ApplicationCommandOptionType} = require("discord.js");

module.exports = {
    data: {
        name: 'play',
        description: 'Play a song!',
        options: [
            {
                name: 'query',
                description: 'The song/playlist/album you want to play',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
        voiceChannel: true
    },
    async execute(interaction, client, player) {
        const query = interaction.options.getString('query');
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });

        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({content: 'Could not join your voice channel', ephemeral: true});
        }

        await interaction.deferReply();

        const tracks = await player.search(query, {
            requestedBy: interaction.user,
            safeSearch: false,
            searchEngine: QueryType.AUTO
        }).then(x => x.tracks);
        if (!tracks || tracks.length === 0) {
            return await interaction.followUp({content: `:x: | Track **${query}** not found`});
        }

        const track = tracks[0];
        await queue.play(track);
        if (!/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(query)) {
            track.searchQuery = query;
        }
        const queueLength = queue.tracks.length;

        tracks.shift();
        const isPlaylist = query.includes('/playlist') || query.includes('/album');
        if (isPlaylist && tracks.length > 1) {
            queue.addTracks(tracks);
        }

        const playEmbed = {
            color: 0xfbd75a,
            title: track.title,
            url: track.url,
            author: {
                name: 'Added to queue',
                icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`
            },
            thumbnail: {
                url: track.thumbnail
            },
            fields: [
                {
                    name: 'Duration',
                    value: track.duration,
                    inline: true
                },
                {
                    name: 'Source',
                    value: track.source,
                    inline: true
                },
                {
                    name: 'Position in queue',
                    value: queueLength === 0 ? 'Now playing' : String(queueLength),
                    inline: true
                }
            ]
        };

        return await interaction.followUp({embeds: [playEmbed]});
    }
};
