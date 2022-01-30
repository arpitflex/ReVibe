const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a certain time!')
        .addIntegerOption((option) =>
            option
                .setName('seconds')
                .setDescription('The time (in seconds!) to navigate to')
                .setRequired(true)
        ),
    async execute(interaction, client, player) {
        if (!interaction.member.voice.channelId) {
            return await interaction.reply({content: 'You are not in a voice channel', ephemeral: true});
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({content: 'You are not in my voice channel', ephemeral: true});
        }

        const queue = player.getQueue(interaction.guildId);
        const seconds = interaction.options.getInteger('seconds');
        await interaction.deferReply();

        await queue.seek(seconds * 1000);

        return await interaction.followUp({content: `:fast_forward: | **Seeking to ${seconds} seconds**`});
    }
}