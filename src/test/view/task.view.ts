import { TaskServiceSchema } from '../service/task.definition.js';
import { ViewModule, View, zViewAny } from '../../public-api.js';
import { ITask } from '../models/task.model.js';

export class TaskView implements ViewModule<typeof TaskServiceSchema> {
  create = View(TaskServiceSchema.create, (res, task: ITask) => {
    return res.status(200).json(task);
  });

  read = View(TaskServiceSchema.read, (res, task: ITask) => {
    return res.status(200).json(task);
  });

  update = View(TaskServiceSchema.update, (res, task: ITask) => {
    return res.status(200).json(task);
  });

  delete = View(TaskServiceSchema.delete, (res) => {
    return res.status(200).send(null);
  });

  notfound = zViewAny((req, res) => res.status(200).send('list'));
}
