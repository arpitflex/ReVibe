module.exports = {
    data: {
        name: 'stop',
        description: 'Stop playback!',
        voiceChannel: true
    },
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        await interaction.deferReply();
        queue.destroy(true);
        return await interaction.followUp({content: `:wave: | **Hou doe!**`});
    }
}