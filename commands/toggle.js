const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle')
        .setDescription('Toggle play/pause!'),
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }

        await interaction.deferReply();
        if (!queue.connection.paused) {
            queue.setPaused(true);
            return await interaction.followUp({content: `:pause_button: | **Paused**`});
        } else {
            queue.setPaused(false);
            return await interaction.followUp({content: `:arrow_forward: | **Continuing playback!**`});
        }
    }
}