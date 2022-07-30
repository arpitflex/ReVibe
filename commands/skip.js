const {SlashCommandBuilder} = require('@discordjs/builders');

const skipCommand = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song!');

module.exports = {
    data: skipCommand, async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        await interaction.deferReply();
        if (!queue.playing) {
            return await interaction.followUp({content: 'No music is currently being played'});
        }
        queue.skip()
        return await interaction.followUp({content: `:next_track: | Skipped **${queue.current.title}**`});
    }
}