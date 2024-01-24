import { ZodObject, ZodRawShape, z } from "zod";
import { RootModule } from "../../module/module.js";
import { Logger } from "../logger/logger.module.js";
import { parse } from "@zodyac/zod-env";

interface ZodEnvOptions {
  path: string;
  ignoreProcessEnv: boolean;
}

type PartialZodEnvOptions = Partial<ZodEnvOptions>;

/**
 * Environment provider
 * Parses environment variables and provides them to the application.
 * Injected glabally.
 *
 * @usage

 * 1 - Declare a Zod schema for your environment variables:
 * In env.z.ts:
 *
 * ```ts
 * import { z } from 'zod';
 *
 * export const zEnv = z.object({
 *   PORT: z.string(),
 *   HOST: z.string(),
 * });
 *
 * export type Environment = z.infer<typeof zEnv>;
 * ```
 *
 * 2 - Use this schema in `EnvProvider.parser()` to parse environment variables.
 * In main.ts:
 * ```ts
 * import { EnvProvider } from '@zodyac/core';
 *
 * EnvProvider.parse(zEnv);
 * ...
 * ```
 *
 * 3 - In a module:
 * ```ts
 * import { Env, Module } from '@zodyac/core';
 * import { Environment } from './env.z';
 *
 * \@Module()
 * export class MyModule {
 *   \@Env() private env: Environment
 *   constructor() {}
 * }
 * ```
 */
@RootModule()
export class EnvProvider<zEnv extends ZodObject<ZodRawShape>> {
  env: z.infer<zEnv>;

  static schema?: ZodObject<ZodRawShape>;
  static config?: PartialZodEnvOptions;

  constructor(private logger: Logger) {
    try {
      if (!EnvProvider.schema) {
        this.logger.warn("Environment:", "No schema provided, skipping.");
        this.env = {};
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.env = <any>parse(EnvProvider.schema, EnvProvider.config);
      }
    } catch (error) {
      this.logger.error("Environment", error);
      process.exit(1);
    }
  }

  static parse<T extends ZodRawShape>(
    schema: ZodObject<T>,
    config?: PartialZodEnvOptions,
  ) {
    EnvProvider.schema = schema;
    EnvProvider.config = config;
  }
}
