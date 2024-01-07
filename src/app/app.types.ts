import { ZodDefault, ZodNumber, ZodObject, z } from "zod";
import { TAnyProviders } from "../modules/module.types.js";
import { zModule } from "../modules/module.class.js";

export type MinEnv = { PORT: number };
export type zMinEnv = { PORT: ZodNumber | ZodDefault<ZodNumber> };

export type zEnv<Z> = ZodObject<Z extends zMinEnv ? Z : never>;
export type zAnyEnv = zEnv<zMinEnv>;

export type zConfig<Z extends zAnyEnv> = {
  env: Z;
  providers?: TAnyProviders;
  // entity: zEntity;
};

export interface TApp<Z extends zAnyEnv> extends zModule<Z> {
  readonly env: z.infer<Z>;
  readonly config: zConfig<Z>;

  start(): void;
  stop(): void;
}

export const INJECTION_TOKEN = {
  logger: "logger",
  express: "express",
  socket: "socket",
} as const;

export type TInjectionToken =
  (typeof INJECTION_TOKEN)[keyof typeof INJECTION_TOKEN];

// eslint-disable-next-line @typescript-eslint/ban-types
export type Injectable = TInjectionToken | {};
