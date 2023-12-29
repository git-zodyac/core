import { Check, Service } from '../../public-api.js';
import { TaskServiceSchema } from './task.definition.js';
import { TaskView } from '../view/task.view.js';

export class TaskService implements Service<typeof TaskServiceSchema> {
  _view = new TaskView();

  create = Check(TaskServiceSchema.create, (req, res) => {
    const data = req.body;

    return this._view.create(res, {
      id: '1',
      title: data.title,
      deadline: data.deadline,
      status: false,
      createdAt: new Date(),
    });
  });

  read = Check(TaskServiceSchema.read, (req, res) => {
    const data = req.params;

    return this._view.read(res, {
      id: data.id,
      title: 'title',
      deadline: new Date(),
      status: false,
      createdAt: new Date(),
    });
  });

  update = Check(TaskServiceSchema.update, (req, res) => {
    const data = req.params;
    const body = req.body;

    return this._view.update(res, {
      id: data.id,
      title: body.title,
      deadline: body.deadline,
      status: body.status ?? false,
      createdAt: new Date(),
    });
  });

  delete = Check(TaskServiceSchema.delete, (req, res) => {
    const data = req.params;
    console.log(data.id);
    return this._view.delete(res);
  });
}
