import { ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';
import { Command, type InteractionButton } from './mod';

export class HelloWorldCommand extends Command {
  name = 'hello';
  description: string = 'Hello World Command';

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
        description_llm: 'Say Hello',
        button: new ButtonBuilder()
          .setCustomId('hello_world_hello')
          .setLabel('Hello')
          .setStyle(ButtonStyle.Primary)
          .toJSON(),
      },
      {
        description_llm: 'Say Goodbye',
        button: new ButtonBuilder()
          .setCustomId('hello_world_goodbye')
          .setLabel('Goodbye')
          .setStyle(ButtonStyle.Danger)
          .toJSON(),
      },
    ];
  }

  async callback(message: string): Promise<string> {
    if (!message) {
      return 'Please provide a message.';
    }

    return 'Hi there! How can I help you?';
  }

  async onInteraction(customId: string): Promise<string> {
    if (customId === 'hello_world_hello') {
      return 'Hello!';
    }
    if (customId === 'hello_world_goodbye') {
      return 'Goodbye...😢';
    }
    return 'Unknown interaction';
  }
}

export const command = new HelloWorldCommand();
