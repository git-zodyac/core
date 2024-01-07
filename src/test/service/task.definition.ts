import { z } from "zod";
import {
  zTaskCreate,
  zTask,
  zTaskId,
  zTaskUpdate,
} from "../models/task.model.js";

export const TaskServiceSchema = {
  create: {
    body: zTaskCreate,
    response: zTask,
  },
  read: {
    params: zTaskId,
    response: zTask,
  },
  update: {
    params: zTaskId,
    body: zTaskUpdate,
    response: zTask,
  },
  delete: {
    params: zTaskId,
    response: z.null(),
  },
};
