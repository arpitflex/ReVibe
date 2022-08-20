const {ApplicationCommandOptionType} = require("discord.js");

module.exports = {
    data: {
        name: 'seek',
        description: 'Seek to a certain time!',
        options: [
            {
                name: 'seconds',
                description: 'The time (in seconds!) to navigate to',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ],
        voiceChannel: true
    },
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        const seconds = interaction.options.getInteger('seconds');
        await interaction.deferReply();

        await queue.seek(seconds * 1000);

        return await interaction.followUp({content: `:fast_forward: | Seeking to **${seconds} seconds**`});
    }
}