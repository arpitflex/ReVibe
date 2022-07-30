const {SlashCommandBuilder} = require('@discordjs/builders');

const seekCommand = new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek to a certain time!')
    .addIntegerOption((option) =>
        option
            .setName('seconds')
            .setDescription('The time (in seconds!) to navigate to')
            .setRequired(true)
    )

module.exports = {
    data: seekCommand, async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        const seconds = interaction.options.getInteger('seconds');
        await interaction.deferReply();

        await queue.seek(seconds * 1000);

        return await interaction.followUp({content: `:fast_forward: | Seeking to **${seconds} seconds**`});
    }
}