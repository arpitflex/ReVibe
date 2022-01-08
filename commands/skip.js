const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song!'),
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: "No music is currently being played",
            });
        await interaction.deferReply();

        queue.skip()

        return await interaction.followUp({content: `:next_track: | Skipped **${queue.current.title}**`});
    }
}