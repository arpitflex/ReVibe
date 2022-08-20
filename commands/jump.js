const {ApplicationCommandOptionType} = require("discord.js");

module.exports = {
    data: {
        name: 'jump',
        description: 'Jump to a particular track!',
        options: [
            {
                name: 'track_number',
                description: 'Track number of song to jump to',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ],
        voiceChannel: true
    },
    async execute(interaction, client, player) {
        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }

        const queue = player.getQueue(interaction.guildId);
        await interaction.deferReply();

        const trackNumber = interaction.options.getInteger('track_number');
        const queueLength = queue.tracks.length;
        if (trackNumber <= 0 || trackNumber > queueLength) {
            return await interaction.followUp({content: `Track **${trackNumber}** is not in queue of currently **${queueLength}** tracks`});
        }

        await queue.skipTo(trackNumber - 1);
        return await interaction.followUp({content: `:arrow_right_hook: | Jumped to track **${trackNumber}** in queue`});
    }
}