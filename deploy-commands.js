const fs = require('fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const {clientId, guildIdTUD, guildIdGDG, token} = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildIdTUD), {body: commands})
    .then(() => console.log('Successfully registered application commands to TU Delft server.'))
    .catch(console.error);

rest.put(Routes.applicationGuildCommands(clientId, guildIdGDG), {body: commands})
    .then(() => console.log('Successfully registered application commands to Gamers Doing Gaming server.'))
    .catch(console.error);