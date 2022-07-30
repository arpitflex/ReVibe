const {SlashCommandBuilder} = require('@discordjs/builders');

const jumpCommand = new SlashCommandBuilder()
    .setName('jump')
    .setDescription('Jump to a particular track!')
    .addIntegerOption((option) =>
        option
            .setName('track_number')
            .setDescription('Track number of song to jump to')
            .setRequired(true)
    );

module.exports = {
    data: jumpCommand, async execute(interaction, client, player) {
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