const {SlashCommandBuilder} = require('@discordjs/builders');
const queueEvent = require('./queue');

const shuffleCommand = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue!');

module.exports = {
    data: shuffleCommand, async execute(interaction, client, player) {
        const queue = player.getQueue(interaction.guildId);
        queue.shuffle();
        return queueEvent.execute(interaction, client, player);
    }
}