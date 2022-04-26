const fs = require('fs');
const {Client, Collection, Intents} = require('discord.js');
const {token} = require('./config.json');
const {Player} = require('discord-player');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});

client.commands = new Collection();

const player = new Player(client, {
    ytdlOptions: {
        requestOptions: {
            headers: {
                cookie: "YSC=wlzowWc807M; CONSENT=YES+yt.444115696.en+FX+897; PREF=f4=4000000&tz=Europe.Berlin&f6=40000000; VISITOR_INFO1_LIVE=kuJjyI95P4w; GPS=1; CONSISTENCY=AGDxDeP7TgEnV4xoQ8HhcDjm6Boaeeq8_-_azXxLrPdpMzQ_J-rbcbluh6tcPrFP3ek9DEbEPeP5I6uRAtKnui2DiEqmeLQRzvvR4bVXmYFSVCCCb9J6zGRANJeb-72qFLaK5cVRnG3NiXR0gd3GJA"
            }
        }
    }
});

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
