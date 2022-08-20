const {ApplicationCommandOptionType} = require('discord.js');

module.exports = {
    data: {
        name: 'remove',
        description: 'Remove a track from the queue!',
        options: [
            {
                name: 'track_number',
                description: 'Track number of song to remove from queue',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ],
        voiceChannel: true
    },
    async execute(interaction, client, player) {
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