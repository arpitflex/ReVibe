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
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);

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