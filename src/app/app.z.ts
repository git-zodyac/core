import { zModule } from "../modules/module.class.js";
import { TApp, zAnyEnv, zConfig } from "./app.types.js";
import { zConsoleLogger } from "../utils/logger/c-logger.module.js";
import { zLogger } from "../utils/logger/logger.types.js";
import { TProvider } from "../modules/module.types.js";
import { parse } from "@zodyac/env";
import { z } from "zod";

const EXIT_SIGNALS = [
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
] as const;

export class zApp<Z extends zAnyEnv> extends zModule<Z> implements TApp<Z> {
  protected get app(): TApp<Z> {
    return this;
  }

  protected _logger: zLogger = new zConsoleLogger();
  public get logger(): zLogger {
    return this._logger;
  }
  public readonly env: z.infer<Z>;

  constructor(public readonly config: zConfig<Z>) {
    super();

    this.env = parse(config.env);

    if (config.providers) {
      for (const provider of config.providers)
        this.provide(provider as TProvider<Z, zModule<Z>>);
    }

    for (const signal of EXIT_SIGNALS) {
      process.on(signal, async () => {
        await this.stop();
        process.exit(0);
      });
    }
  }

  override readonly parent = undefined;

  public async start(): Promise<void> {
    await this.__init();
    await this.__ready();
    await this.__start();
  }

  public async stop(): Promise<void> {
    await this.__destroy();
  }
}
