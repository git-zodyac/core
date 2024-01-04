import { Request, Response, Handler } from "express";
import { zServiceShape } from "../service/service.types.js";
import { zGuardConstructor } from "./router.guards.js";
import { Guard as Checkers } from "./router.checks.js";
import { zRouter } from "./router.module.js";
import { zAnyEnv } from "../app/app.types";

export type zRouteMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"
  | "all";

export type zEndpoint<
  Params = Record<string, string>,
  Body = unknown,
  Query = Record<string, string>,
  TRes = unknown,
> = (
  req: Request<Params, TRes, Body, Query>,
  res: Response<TRes>,
) => Response<TRes>;

export interface zRoutePath {
  path: string;
  checks?: Checkers[];
  // middleware?: ze.Middleware[];
}

export interface zRouteEndpoint extends zRoutePath {
  method: zRouteMethod;
  handler: zEndpoint | Handler[];
}

export interface zRouteGroup extends zRoutePath {
  routes: zRoute[]; // TODO: Route[]
}

export interface zRouteModule extends zRoutePath {
  module: zRouter;
}

export type zRoute = zRoutePath | zRouteEndpoint | zRouteGroup | zRouteModule;

export interface zRouteGuard<
  Obj extends zServiceShape[string],
  Z extends zAnyEnv = zAnyEnv,
> extends zRoutePath {
  guards: zGuardConstructor<Obj, Z>[];
}

export interface zRouteGuardEndpoint<
  Obj extends zServiceShape[string],
  Z extends zAnyEnv = zAnyEnv,
> extends zRoutePath {
  guards: zGuardConstructor<Obj, Z>[];
}

export interface zRouteGuardGroup<
  Obj extends zServiceShape[string],
  Z extends zAnyEnv = zAnyEnv,
> extends zRouteGuard<Obj, Z> {
  routes: zRoute[];
}

export interface zRouteGuardModule<
  Obj extends zServiceShape[string],
  Z extends zAnyEnv = zAnyEnv,
> extends zRouteGuard<Obj, Z> {
  module: zRouter;
}

export type zRouteGuarded<
  Obj extends zServiceShape[string],
  Z extends zAnyEnv = zAnyEnv,
> =
  | zRouteGuard<Obj, Z>
  | zRouteGuardEndpoint<Obj, Z>
  | zRouteGuardGroup<Obj, Z>
  | zRouteGuardModule<Obj, Z>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type zRoutes = (zRoute | zRouteGuarded<any, any>)[];

export function zRoutes(routes: zRoutes) {
  return routes;
}
