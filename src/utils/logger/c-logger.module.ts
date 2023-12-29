import { zLoggerModule } from './logger.module.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class zConsoleLogger extends zLoggerModule {
  log(...args: any[]) {
    console.log(time(), '|', ...args);
  }

  info(...args: any[]) {
    console.info(time(green), '|', ...args);
  }

  warn(...args: any[]) {
    console.warn(time(yellow), '|', ...args);
  }

  error(...args: any[]) {
    console.error(time(red), '|', ...args);
  }

  debug(...args: any[]) {
    console.debug(time(cyan), '|', ...args);
  }

  trace(...args: any[]) {
    console.trace(time(magenta), '|', ...args);
  }
}

function red(str: string): string {
  return `\u001b[31m${str}\u001b[0m`;
}
function green(str: string): string {
  return `\u001b[32m${str}\u001b[0m`;
}
function yellow(str: string): string {
  return `\u001b[33m${str}\u001b[0m`;
}
function magenta(str: string): string {
  return `\u001b[35m${str}\u001b[0m`;
}
function cyan(str: string): string {
  return `\u001b[36m${str}\u001b[0m`;
}

function time(colorfn?: (arg0: string) => string): string {
  const value = new Date().toLocaleTimeString('short');
  return colorfn ? colorfn(value) : value;
}
