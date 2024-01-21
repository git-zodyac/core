/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A logger interface.
 * Use this interface to create your own logger which will be used by the core.
 */
export interface zLogger {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
}
