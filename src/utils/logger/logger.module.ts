/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootModule } from "../../module/module.js";
import { zLogger } from "./logger.types.js";
import { Colors } from "./colors.js";

/**
 * Default logger module for the application.
 *
 * @export
 * @class Logger
 * @implements {zLogger}
 *
 * @example
 * ```ts
 * import { Logger, Module } from '@zodyac/core';
 *
 * \@Module()
 * export class MyModule {
 *   constructor(private logger: Logger) {
 *     this.logger.log('Hello World!');
 *   }
 *
 *   public onInit(): void {
 *     this.logger.log('OnInit hook triggered');
 *   }
 * }
 * ```
 *
 * Using your own logger:
 * ```ts
 * import { zLogger, Module } from '@zodyac/core';
 *
 * \@Module()
 * export class MyLogger implements zLogger {
 *   log(...args: any[]): void {
 *     console.log(...args);
 *   }
 *
 *   //... Other methods
 * }
 * ```
 *
 * And in your app.module.ts:
 * ```ts
 * import { Module, Logger } from '@zodyac/core';
 * import { MyLogger } from './my-logger.module.js';
 *
 * \@Module({
 *   provide: [
 *     {
 *       provide: Logger,
 *       useClass: MyLogger,
 *     },
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
@RootModule()
export class Logger implements zLogger {
  log(...args: any[]): void {
    console.log(time(), "|", ...args);
  }

  info(...args: any[]): void {
    console.info(time(Colors.green), "|", ...args);
  }

  warn(...args: any[]): void {
    console.warn(time(Colors.yellow), "|", ...args);
  }

  error(...args: any[]): void {
    console.error(time(Colors.red), "|", ...args);
  }

  debug(...args: any[]): void {
    console.debug(time(Colors.cyan), "|", ...args);
  }

  trace(...args: any[]): void {
    console.trace(time(Colors.magenta), "|", ...args);
  }
}

export function time(colorfn?: (arg0: string) => string): string {
  const value = new Date().toLocaleTimeString("short");
  return colorfn ? colorfn(value) : value;
}
