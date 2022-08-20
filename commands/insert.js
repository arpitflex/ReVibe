const {QueryType} = require('discord-player');
const {ApplicationCommandOptionType} = require("discord.js");

module.exports = {
    data: {
        name: 'insert',
        description: 'Play a song at particular index!',
        options: [
            {
                name: 'query',
                description: 'The song/playlist/album you want to play',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'index',
                description: 'Index to add the track to',
                type: ApplicationCommandOptionType.Integer,
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
        track.searchQuery = query;
        const index = interaction.options.getInteger('index');
        const position = Math.min(Math.max(0, index) - 1, queue.tracks.length)
        await queue.insert(track, position);

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
                    value: String(position),
                    inline: true
                }
            ]
        };

        return await interaction.followUp({embeds: [playEmbed]});
    }
}