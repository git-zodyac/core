import { z } from "zod";

export const zEnv = z.object({
  PORT: z.number().default(3000),
  some: z.string().default("Bebra"),
});
