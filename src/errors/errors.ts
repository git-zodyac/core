/* eslint-disable @typescript-eslint/no-explicit-any */
import { Colors } from "../utils/logger/colors.js";

const ErrorSemantic = {
  notModule: "ZY0000",
  doubleProvide: "ZY0001",
  notProvided: "ZY0002",
  incorrect: "ZY0003",
  noField: "ZY0004",
  constructorSus: "ZY0005",
  circular: "ZY0006",
} as const;

const ErrorDescription = {
  ZY0000: "Not a Module",
  ZY0001: "Module already provided",
  ZY0002: "Module not provided",
  ZY0003: "Module is declared incorrectly",
  ZY0004: "Requested field does not exist",
  ZY0005: "Module constructor requires non-module argument",
  ZY0006: "Circular dependency detected",
} as const;

const ErrorMessage = {
  ZY0000: (module: string) =>
    `Module ${Colors.magenta(
      module,
    )} in not declared. Don't forget to add ${Colors.magenta(
      "@Module()",
    )} decorator on it's class.`,
  ZY0001: (module: string) =>
    `Module ${Colors.magenta(
      module,
    )} is already provided in the same ${Colors.magenta(module)} Module`,
  ZY0002: (module: string) =>
    `Module ${Colors.magenta(
      module,
    )} is not provided. Don't forget to provide it.`,
  ZY0003: (module: string) =>
    `Module ${Colors.magenta(module)} is declared incorrectly.`,
  ZY0004: (field: string | symbol, type: string) =>
    `Field ${Colors.cyan(field.toString())} does not exist in ${Colors.magenta(
      type,
    )}.`,
  ZY0005: (module: string, type: string) =>
    `Module ${Colors.magenta(
      module,
    )} constructor requires a non-module argument. Required type is ${Colors.red(
      type,
    )}.`,
  ZY0006: (module: string) =>
    `Circular dependency detected in ${Colors.magenta(module)}.`,
} as const;

type ValuesOf<T> = T[keyof T];
type ArgsOf<T> = T extends (...args: infer U) => any ? U : never;

export interface TError {
  code: keyof typeof ErrorDescription;
  description: (typeof ErrorDescription)[keyof typeof ErrorDescription];
  message: (...args: any[]) => string;
}

export class zError<T extends ValuesOf<typeof ErrorMessage>> implements TError {
  code: keyof typeof ErrorDescription;
  description: ValuesOf<typeof ErrorDescription>;
  message: T;

  constructor(code: keyof typeof ErrorDescription) {
    this.code = code;
    this.description = ErrorDescription[code];
    this.message = <T>ErrorMessage[code];
  }

  static of(sem: keyof typeof ErrorSemantic) {
    const code = ErrorSemantic[sem];
    return new zError<(typeof ErrorMessage)[typeof code]>(code);
  }

  throw(...args: ArgsOf<T>): never {
    // @ts-expect-error – making TS happy
    const message = this.message.apply(null, args);
    throw new Error(message);
  }
}
