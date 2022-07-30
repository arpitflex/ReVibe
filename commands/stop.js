const {SlashCommandBuilder} = require('@discordjs/builders');

const stopCommand = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playback!');

module.exports = {
    data: stopCommand, async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        await interaction.deferReply();
        queue.destroy(true);
        return await interaction.followUp({content: `:wave: | **Hou doe!**`});
    }
}