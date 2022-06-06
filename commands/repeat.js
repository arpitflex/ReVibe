const {SlashCommandBuilder} = require('@discordjs/builders');
const {QueueRepeatMode} = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Change repeat mode!')
        .addIntegerOption((option) =>
            option
                .setName('mode')
                .setDescription('The repeat mode')
                .addChoices(
                    {name: 'OFF', value: QueueRepeatMode.OFF},
                    {name: 'TRACK', value: QueueRepeatMode.TRACK},
                    {name: 'QUEUE', value: QueueRepeatMode.QUEUE},
                    {name: 'AUTOPLAY', value: QueueRepeatMode.AUTOPLAY}
                )
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
        const mode = interaction.options.getInteger('mode');
        await interaction.deferReply();

        await queue.setRepeatMode(mode);

        let content = '';
        switch (mode) {
            case QueueRepeatMode.OFF:
                content = ':arrow_right:';
                break;
            case QueueRepeatMode.TRACK:
                content = ':repeat_one:';
                break;
            case QueueRepeatMode.QUEUE:
                content = ':repeat:';
                break;
            case QueueRepeatMode.AUTOPLAY:
                content = ':robot:';
                break;
            default:
                console.error('Impossible repeat choice selected', mode);
        }
        return await interaction.followUp({content: `${content} | Repeat mode set to ${QueueRepeatMode[mode]}`});
    }
}