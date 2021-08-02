import { getCompilerSystem } from './state/stencil-cli-config';
import { readJson, uuidv4 } from './telemetry/helpers';

export const defaultConfig = () =>
  getCompilerSystem().resolvePath(`${getCompilerSystem().homeDir()}/.ionic/config.json`);

export const defaultConfigDirectory = () => getCompilerSystem().resolvePath(`${getCompilerSystem().homeDir()}/.ionic`);

export interface TelemetryConfig {
  'telemetry.stencil'?: boolean;
  'tokens.telemetry'?: string;
}

export async function readConfig(): Promise<TelemetryConfig> {
  let config: TelemetryConfig = await readJson(defaultConfig());

  if (!config) {
    config = {
      'tokens.telemetry': uuidv4(),
      'telemetry.stencil': true,
    };

    await writeConfig(config);
  }

  return config;
}

export async function writeConfig(config: TelemetryConfig): Promise<void> {
  try {
    await getCompilerSystem().createDir(defaultConfigDirectory(), { recursive: true });
    await getCompilerSystem().writeFile(defaultConfig(), JSON.stringify(config));
  } catch (error) {
    console.error(`Stencil Telemetry: couldn't write configuration file to ${defaultConfig()} - ${error}.`);
  }
}

export async function updateConfig(newOptions: TelemetryConfig): Promise<void> {
  const config = await readConfig();
  await writeConfig(Object.assign(config, newOptions));
}
