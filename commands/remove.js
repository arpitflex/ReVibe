const {SlashCommandBuilder} = require('@discordjs/builders');

const removeCommand = new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a track from the queue!')
    .addIntegerOption((option) =>
        option
            .setName('track_number')
            .setDescription('Track number of song to remove from queue')
            .setRequired(true)
    );

module.exports = {
    data: removeCommand, async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        await interaction.deferReply();

        const trackNumber = interaction.options.getInteger('track_number');
        const queueLength = queue.tracks.length;
        if (trackNumber <= 0 || trackNumber > queueLength) {
            return await interaction.followUp({content: `Track **${trackNumber}** is not in queue of currently **${queueLength}** tracks`});
        }

        const removed = queue.remove(trackNumber - 1);
        return await interaction.followUp({content: `:wastebasket: | Removed **${removed.title}** from queue`});
    }
}