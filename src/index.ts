import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  type Interaction,
} from 'discord.js';
import { CLIENT_ID, GUILD_ID, TOKEN } from './env';
import { Command, loadCommands } from './commands/mod';

const rest = new REST().setToken(TOKEN!);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = await loadCommands();

const commandHandle = async (command: Command, interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== command.name) return;

  const message = interaction.options.getString('message');
  if (!message) {
    await interaction.reply('Please provide a message.');
    return;
  }

  const response = await command.callback(message);
  const replyResponse = await interaction.reply({
    content: response,
    components: command.interactionButtons.map((button) => ({
      type: 1,
      components: [button.button],
    })),
    withResponse: true,
  });

  const collectorFilter = (i: Interaction) => i.user.id === interaction.user.id;

  const replyWhenFaild = async () =>
    await interaction.reply({
      content: 'Confirmation not received within 1 minute, cancelling',
      components: [],
    });

  try {
    const confirmation =
      await replyResponse.resource?.message?.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });

    if (confirmation) {
      const response = await command.onInteraction(confirmation.customId);

      await confirmation.reply({ content: response, components: [] });
    } else {
      await replyWhenFaild();
    }
  } catch {
    await replyWhenFaild();
  }
};

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  for (const command of commands) {
    await commandHandle(command, interaction);
  }
});

const initSlashCommands = async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!), {
      body: commands.map((command) => command.slashCommandData),
    });

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
};

await initSlashCommands();

client.login(TOKEN);
