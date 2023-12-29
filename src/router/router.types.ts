import { ze } from '@bebrasmell/zod-express';
import { zRouter } from './router.module';
import { Handler } from 'express';

export type zRouteMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'
  | 'all';

export interface zRoutePath {
  path: string;
  // middleware?: ze.Middleware[];
}

export interface zRouteEndpoint extends zRoutePath {
  method: zRouteMethod;
  handler: ze.Endpoint | Handler[];
}

export interface zRouteGroup extends zRoutePath {
  routes: zRoute[]; // TODO: Route[]
}

export interface zRouteModule extends zRoutePath {
  module: zRouter;
}

export type zRoute = zRouteEndpoint | zRouteGroup | zRouteModule;
export type zRoutes = zRoute[];

export function zRoutes(routes: zRoutes) {
  return routes;
}
