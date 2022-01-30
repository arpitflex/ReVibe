const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the current queue!'),
    async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        const tracks = queue.tracks;
        if (!queue.playing) {
            return await interaction.reply({content: 'No music is currently being played', ephemeral: true});
        }

        const messages = [];
        let chunk = 0;
        messages[chunk] = '';
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const details = `\`${i + 1}\` [${track.title}](${track.url}) | \`${track.duration} Requested by: ${track.requestedBy.username}\`\n`;
            if (messages[chunk].length + details.length < 1024) {
                messages[chunk] = messages[chunk].concat(details);
            } else {
                chunk++;
                messages[chunk] = details;
            }
        }

        const embeds = [];
        for (let i = 0; i < messages.length; i++) {
            if (i === 0) {
                const current = queue.current;
                embeds[i] = new MessageEmbed()
                    .setColor('#fbd75a')
                    .setTitle('Queue')
                    .addField(':arrow_forward: | Now Playing:', `[${current.title}](${current.url}) | \`${current.duration} Requested by: ${current.requestedBy.username}\``)
                    .setFooter({
                        text: `${tracks.length === 1 ? '1 track' : tracks.length + ' tracks'} in queue${messages.length > 0 ? `. Part ${i + 1}/${messages.length}`: ''}`,
                        iconURL: interaction.user.avatar?.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.gif` : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`
                    });
                if (tracks.length !== 0) {
                    embeds[i]
                        .addField('\u200b', '\u200b')
                        .addField(':arrow_heading_down: | Up Next:', messages[i])
                }
            } else {
                embeds[i] = new MessageEmbed()
                    .setColor('#fbd75a')
                    .setTitle('Queue')
                    .addField(':arrow_heading_down: | Up Next:', messages[i])
                    .setFooter({
                        text: `${tracks.length === 1 ? '1 track' : tracks.length + ' tracks'} in queue. Part ${i + 1}/${messages.length}`,
                        iconURL: interaction.user.avatar?.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.gif` : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`
                    });
            }
        }

        await interaction.deferReply();
        return await interaction.followUp({embeds: embeds});
    }
}