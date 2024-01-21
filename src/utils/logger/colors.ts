/**
 * @module Colors
 * Color helpers for logging.
 * Supported colors:
 * - red
 * - green
 * - yellow
 * - magenta
 * - cyan
 *
 * @example
 * ```ts
 * import { Colors } from '@zodyac/core';
 *
 * console.log(Colors.red('I AM RED AND PRETTY'));
 * ```
 */
export namespace Colors {
  export function red(str: string): string {
    return `\u001b[31m${str}\u001b[0m`;
  }

  export function green(str: string): string {
    return `\u001b[32m${str}\u001b[0m`;
  }

  export function yellow(str: string): string {
    return `\u001b[33m${str}\u001b[0m`;
  }

  export function magenta(str: string): string {
    return `\u001b[35m${str}\u001b[0m`;
  }

  export function cyan(str: string): string {
    return `\u001b[36m${str}\u001b[0m`;
  }
}
