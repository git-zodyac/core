import { Router } from 'express';
import { zRoutes } from './router.types.js';

export class zRouter {
  protected readonly _router = Router();
  public get router() {
    return this._router;
  }

  constructor(private readonly routes: zRoutes) {
    for (const route of routes) {
      // if ('middleware' in route) {
      //   this._router.use(route.path, ...route.middleware);
      // }

      if ('module' in route) {
        this._router.use(route.path, route.module.router);
      }

      if ('method' in route) {
        if (typeof route.handler === 'function') {
          this._router[route.method](route.path, route.handler);
          continue;
        }

        this._router[route.method](route.path, ...route.handler);
        continue;
      }
      if ('routes' in route) {
        this._router.use(route.path, new zRouter(route.routes).router);
        continue;
      }
    }
  }
}

export function z_provideRoutes(routes: zRoutes) {
  return new zRouter(routes);
}
