const {QueryType} = require("discord-player");
const {SlashCommandBuilder} = require('@discordjs/builders');

const playCommand = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song!')
    .addStringOption((option) =>
        option
            .setName('query')
            .setDescription('The song/playlist/album you want to play')
            .setRequired(true)
    );

module.exports = {
    data: playCommand, async execute(interaction, client, player) {
        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: "You are not in a voice channel!", ephemeral: true});
        }

        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: "You are not in my voice channel!", ephemeral: true});
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
            return await interaction.reply({content: "Could not join your voice channel!", ephemeral: true});
        }

        await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user,
            safeSearch: false,
            searchEngine: QueryType.AUTO
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({content: `:x: | Track **${query}** not found`});

        queue.play(track);

        return await interaction.followUp({content: `:timer: | Loading track **${track.title}**`});
    }
};
