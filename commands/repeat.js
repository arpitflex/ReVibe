const {SlashCommandBuilder} = require('@discordjs/builders');
const {QueueRepeatMode} = require('discord-player');

const repeatCommand = new SlashCommandBuilder()
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
    );

module.exports = {
    data: repeatCommand, async execute(interaction, client, player) {
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