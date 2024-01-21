import { Colors } from "../utils/logger/colors.js";
import { RootProvider } from "../global/global.provider.js";
import { zModule, zModuleType } from "../module/module.types.js";

const EXIT_SIGNALS = [
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
] as const;

/**
 * Bootstraps the module to be your primary application entrypoint.
 * @param module The module to be bootstrapped.
 */
export async function runApp<T extends zModule>(
  module: zModuleType<T>,
): Promise<T> {
  try {
    const root = module.prototype;

    // Inject global providers
    for (const provider of RootProvider.modules) root.__provide!(provider);

    // TODO: Force creating root instances

    // Create instance
    const instance = await root.__create!();

    // Exit signals
    for (const signal of EXIT_SIGNALS) {
      process.on(signal, async () => {
        await instance.prototype!.__stop!();
        process.exit(0);
      });
    }

    // Run application
    await instance.prototype!.__init!();
    return instance;
  } catch (error) {
    console.error(Colors.red("❗️ Zodyac Core"), error);
    process.exit(1);
  }
}
