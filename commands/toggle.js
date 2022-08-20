module.exports = {
    data: {
        name: 'toggle',
        description: 'Toggle play/pause!',
        voiceChannel: true
    },
    async execute(interaction, client, player) {
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