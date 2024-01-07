import { TaskService } from "../service/task.service.js";
import { Routes } from "../../public-api.js";

const service = new TaskService();
export const task_routes = Routes([
  {
    path: "/",
    method: "put",
    handler: service.create,
  },
  {
    path: "/:id",
    method: "get",
    handler: service.read,
  },
  {
    path: "/:id",
    method: "post",
    handler: service.update,
  },
  {
    path: "/:id",
    method: "delete",
    handler: service.delete,
  },
]);
