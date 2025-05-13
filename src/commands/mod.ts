import { Glob } from 'bun';
import {
  type APIButtonComponent,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

export type InteractionButton = {
  description: string;
  button: APIButtonComponent;
};

export abstract class Command {
  abstract name: string;
  abstract description: string;
  abstract interactionButtons: InteractionButton[];
  abstract slashCommandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
  abstract init(): Promise<void>;

  abstract callback(message: string): Promise<string>;
  abstract onInteraction(customId: string): Promise<string>;
}

export async function loadCommands(): Promise<Command[]> {
  const glob = new Glob('*.ts');
  const scanOptions = {
    cwd: import.meta.dirname,
    absolute: true,
  };
  const files = glob.scan(scanOptions);

  const commands: Command[] = [];

  for await (const file of files) {
    // Exculde the current file
    if (file === import.meta.path) continue;

    const mod = await import(file);
    if (mod.command && mod.command instanceof Command) {
      commands.push(mod.command as Command);
      await mod.command.init();
      console.log(`Loaded command file: ${file}`);
    } else {
      console.warn(`Invalid plugin file: ${file}`);
    }
  }

  return commands;
}
