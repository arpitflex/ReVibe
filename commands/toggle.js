const {SlashCommandBuilder} = require('@discordjs/builders');

const toggleCommand = new SlashCommandBuilder()
    .setName('toggle')
    .setDescription('Toggle play/pause!');

module.exports = {
    data: toggleCommand, async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        await interaction.deferReply();
        if (!queue.connection.paused) {
            queue.setPaused(true);
            return await interaction.followUp({content: `:pause_button: | **Paused**`});
        } else {
            queue.setPaused(false);
            return await interaction.followUp({content: `:arrow_forward: | **Continuing playback**`});
        }
    }
}