const {SlashCommandBuilder} = require('@discordjs/builders');

const backCommand = new SlashCommandBuilder()
    .setName('back')
    .setDescription('Play the previous song!');

module.exports = {
    data: backCommand, async execute(interaction, client, player) {
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