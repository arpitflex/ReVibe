const fs = require('fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord.js');
const {clientId, guilds, token} = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data);
}

const rest = new REST({version: '10'}).setToken(token);

guilds.forEach(g => rest.put(Routes.applicationGuildCommands(clientId, g[1]), {body: commands})
    .then(() => console.log(`Successfully registered application commands to ${g[0]} server.`))
    .catch(console.error));