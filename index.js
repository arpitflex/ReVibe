const fs = require('fs');
const {Client, Collection, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');
const {Player} = require('discord-player');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});

client.commands = new Collection();

const player = new Player(client);

player.on('trackStart', (queue, track) => queue.metadata.channel.send(`:musical_note: | Now playing **${track.title}**`));
player.on('error', (queue, error) => {
    console.error(error);
    const tracks = queue.tracks;
    console.log(tracks);
    queue.metadata.channel.send(`:interrobang: | Error encountered check logs: ${error.name}`);
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (args) => event.execute(args, client, player));
    } else {
        client.on(event.name, (args) => event.execute(args, client, player));
    }
}

client.login(token);
