import { EnvProvider } from "./env.module.js";

/**
 * Environment decorator
 * Loads parsed environment variables into a class property.
 * Make sure to inject the EnvProvider into your module.
 *
 * @example In main.ts:
 * ```ts
 * import { EnvProvider } from '@zodyac/core';
 * import { zEnv } from 'env.z';
 *
 * EnvProvider.parse(zEnv);
 *
 * ...
 * ```
 *
 * @example In some.module.ts:
 * ```ts
 * import { Env, Module } from '@zodyac/core';
 * import { Environment } from 'env.z';
 *
 * \@Module()
 * class SomeModule {
 *   \@Env()
 *   public myEnv: Environment;
 *
 *   onInit() {
 *     console.log(this.myEnv);
 *   }
 * }
 * ```
 */
export function Env() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string) {
    if (!target.__requires) target.__requires = [];

    target.__requires.push({
      key: propertyKey,
      read: "env",
      from: EnvProvider,
    });
  };
}
