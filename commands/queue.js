const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

const queueCommand = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the current queue!');

module.exports = {
    data: queueCommand, async execute(interaction, client, player) {
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
        let i = 0;
        while (i < messages.length && i < 5) {
            if (i === 0) {
                const current = queue.current;
                embeds[i] = new MessageEmbed()
                    .setColor('#fbd75a')
                    .setTitle('Queue')
                    .addField(':arrow_forward: | Now Playing:', `[${current.title}](${current.url}) | \`${current.duration} Requested by: ${current.requestedBy.username}\``)
                    .setFooter({
                        text: `${tracks.length === 1 ? '1 track' : tracks.length + ' tracks'} in queue${messages.length > 0 ? `. Part ${i + 1}/${messages.length}` : ''}`,
                        iconURL: interaction.user.avatar?.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.gif` : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`
                    });
                if (tracks.length !== 0) {
                    embeds[i]
                        .addField('\u200b', '\u200b')
                        .addField(':arrow_heading_down: | Up Next:', messages[i])
                }
            } else if (i === 4 && messages.length !== 5) {
                embeds[i] = new MessageEmbed()
                    .setColor('#fbd75a')
                    .setTitle('Queue')
                    .addField(':arrow_heading_down: | Up Next:', messages[i])
                    .setFooter({
                        text: `${tracks.length === 1 ? '1 track' : tracks.length + ' tracks'} in queue. Part ${i + 1}/${messages.length}. More Parts can be shown as the queue progresses!`,
                        iconURL: interaction.user.avatar?.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.gif` : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`
                    });
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

            i++;
        }

        await interaction.deferReply();
        return await interaction.followUp({embeds: embeds});
    }
}