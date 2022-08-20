module.exports = {
    data: {
        name: 'shuffle',
        description: 'Shuffle the queue!',
        voiceChannel: true
    },
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        queue.shuffle();
        return await interaction.followUp({content: `:twister_rightwards_arrows: | Queue has been **shuffled**`})
    }
}