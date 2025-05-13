import { ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';
import { Command, type InteractionButton } from './mod';

export class LLMCommand extends Command {
  name = 'llm';
  description: string = 'Chat with LLM Agent';

  slashCommandData = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((option) => {
      return option
        .setName('message')
        .setDescription('The message to send')
        .setRequired(true);
    })
    .toJSON();

  interactionButtons: InteractionButton[];

  constructor() {
    super();
    this.interactionButtons = [
      {
        description: 'Accepted',
        button: new ButtonBuilder()
          .setCustomId('llm_command_accept')
          .setLabel('Accept')
          .setStyle(ButtonStyle.Primary)
          .toJSON(),
      },
      {
        description: 'Declined',
        button: new ButtonBuilder()
          .setCustomId('llm_command_decline')
          .setLabel('Decline')
          .setStyle(ButtonStyle.Danger)
          .toJSON(),
      },
    ];
  }

  async init(): Promise<void> {}

  async callback(message: string): Promise<string> {
    if (!message) {
      return 'Please provide a message.';
    }

    return 'Hi there! How can I help you?';
  }

  async onInteraction(customId: string): Promise<string> {
    if (customId === 'llm_command_accept') {
      return 'Hello!';
    }
    if (customId === 'llm_command_decline') {
      return 'Goodbye...😢';
    }
    return 'Unknown interaction';
  }
}

export const command = new LLMCommand();
