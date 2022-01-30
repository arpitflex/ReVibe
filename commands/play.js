const {QueryType} = require('discord-player');
const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require("discord.js");

const playCommand = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song!')
    .addStringOption((option) =>
        option
            .setName('query')
            .setDescription('The song/playlist/album you want to play')
            .setRequired(true)
    );

module.exports = {
    data: playCommand, async execute(interaction, client, player) {
        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }

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

        tracks.shift();
        const isPlaylist = query.includes('/playlist' || '/album');
        if (isPlaylist && tracks.length > 1) {
            queue.addTracks(tracks)
        }

        const queueLength = queue.tracks.length;
        const playEmbed = new MessageEmbed()
            .setColor('#fbd75a')
            .setTitle(track.title)
            .setURL(track.url)
            .setAuthor({
                name: 'Added to queue',
                iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`
            })
            .setThumbnail(track.thumbnail)
            .addField('Duration', track.duration, true)
            .addField('Source', track.source, true)
            .addField('Position in queue', queueLength === 0 ? 'Now playing' : String(queueLength), true);

        return await interaction.followUp({embeds: [playEmbed]});
    }
};
