import { z } from "zod";

export const zAppEnv = z.object({
  PORT: z.number().default(3000),
  some: z.string().default("some"),
});

export type zAppEnv = typeof zAppEnv;
export type AppEnv = z.infer<typeof zAppEnv>;
