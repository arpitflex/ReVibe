const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Play the previous song!'),
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }

        await interaction.deferReply();

        if (queue.previousTracks.length <= 1) {
            return await interaction.followUp({content: 'No previous tracks', ephemeral: true});
        }

        await queue.back()

        return await interaction.followUp({content: `:previous_track: | Playing **${queue.current.title}** again`, ephemeral: true});
    }
}