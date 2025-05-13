import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);

    // Deploy slash command
    rest.put(Routes.applicationCommands(client.user?.id!), {
        body: [
            {
                name: 'ping',
                description: 'Replies with Pong!',
            },
        ],
    });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login(process.env.DISCORD_TOKEN);
