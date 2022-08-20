module.exports = {
    data: {
        name: 'back',
        description: 'Play the previous song!',
        voiceChannel: true
    },
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        await interaction.deferReply();
        if (queue.previousTracks.length <= 1) {
            return await interaction.followUp({content: 'No previous tracks', ephemeral: true});
        }
        await queue.back()
        return await interaction.followUp({
            content: `:previous_track: | Playing **${queue.current.title}** again`,
            ephemeral: true
        });
    }
}