import { z } from "zod";

export const zTask = z.object({
  id: z.string(),
  title: z.string(),
  deadline: z.date(),
  status: z.boolean().default(false),
  createdAt: z.date(),
});
export type ITask = z.infer<typeof zTask>;
export const zTaskId = zTask.pick({ id: true });
export const zTaskCreate = zTask.pick({
  title: true,
  deadline: true,
});

export const zTaskUpdate = zTask.pick({
  title: true,
  deadline: true,
  status: true,
});
