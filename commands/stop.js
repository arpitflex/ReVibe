const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playback!'),
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }

        await interaction.deferReply();
        queue.destroy(true);
        return await interaction.followUp({content: `:wave: | **Hou doe!**`});
    }
}