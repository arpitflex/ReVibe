const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the current queue!'),
    async execute(interaction, client, player) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        const tracks = queue.tracks;
        if (!queue.playing) {
            return await interaction.followUp({content: 'No music is currently being played', ephemeral: true});
        }

        let queueMessage = '';
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            queueMessage = queueMessage.concat(`\`${i + 1}\` [${track.title}](${track.url}) | \`${track.duration} Requested by: ${track.requestedBy.username}\`\n`);
        }

        const current = queue.current;
        const queueEmbed = new MessageEmbed()
            .setColor('#fbd75a')
            .setTitle('Queue')
            .addField(':arrow_forward: | Now Playing:', `[${current.title}](${current.url}) | \`${current.duration} Requested by: ${current.requestedBy.username}\``)
            .setFooter({
                text: `${tracks.length === 1 ? '1 track' : tracks.length + ' tracks'} in queue`,
                iconURL: interaction.user.avatar.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.gif` : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`
            });
        if (tracks.length !== 0) {
            queueEmbed
                .addField('\u200b', '\u200b')
                .addField(':arrow_heading_down: | Up Next:', queueMessage)
        }

        return await interaction.followUp({embeds: [queueEmbed]});
    }
}