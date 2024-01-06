/* eslint-disable @typescript-eslint/no-explicit-any */
import { INJECTION_TOKEN } from "../../app/app.types.js";
import { zModule } from "../../modules/module.class.js";
import { zLogger } from "./logger.types.js";

export abstract class zLoggerModule extends zModule<any> implements zLogger {
  protected _token = INJECTION_TOKEN.logger;

  abstract log(...args: any[]): void;
  abstract info(...args: any[]): void;
  abstract warn(...args: any[]): void;
  abstract error(...args: any[]): void;
  abstract debug(...args: any[]): void;
  abstract trace(...args: any[]): void;
}
