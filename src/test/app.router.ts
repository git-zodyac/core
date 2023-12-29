import { Routes } from '../public-api.js';
import { task_routes } from './routers/task.routes.js';

export const routes = Routes([
  {
    path: '/',
    method: 'get',
    handler: (req, res) => {
      res.send('Hello, world!');
    },
  },
  {
    path: '/task',
    routes: task_routes,
  },
]);
