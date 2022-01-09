const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a track from the queue!')
        .addIntegerOption((option) =>
            option
                .setName('track_number')
                .setDescription('Track number of song to remove from queue')
                .setRequired(true)
        ),
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }

        await interaction.deferReply();
        if (!queue?.playing)
            return await interaction.followUp({content: 'No music is currently being played'});

        const trackNumber = interaction.options.getInteger('track_number');
        const queueLength = queue.tracks.length;
        if (trackNumber <= 0 || trackNumber > queueLength) {
            return await interaction.followUp({content: `Track **${trackNumber}** is not in queue of currently **${queueLength}** tracks`});
        }

        const removed = queue.remove(trackNumber - 1);
        return await interaction.followUp({content: `:wastebasket: | Removed **${removed.title}** from queue`});
    }
}