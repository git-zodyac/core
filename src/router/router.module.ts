import { Router } from "express";
import { zRoutes } from "./router.types.js";
import { zGuardToMiddleware } from "./router.checks.js";

export class zRouter {
  protected readonly _router = Router();
  public get router() {
    return this._router;
  }

  constructor(private readonly routes: zRoutes) {
    for (const route of routes) {
      const guards = route.checks?.map(zGuardToMiddleware) ?? [];

      if ("guards" in route) {
        for (const guard of route.guards) {
          const guardInstance = new guard();
          guards.push(zGuardToMiddleware(guardInstance.canPass));
        }
      }

      // if ('middleware' in route) {
      //   this._router.use(route.path, ...route.middleware);
      // }

      if ("module" in route) {
        this._router.use(route.path, ...guards, route.module.router);
      }

      if ("method" in route) {
        if (typeof route.handler === "function") {
          this._router[route.method](route.path, ...guards, route.handler);
          continue;
        }

        this._router[route.method](route.path, ...guards, ...route.handler);
        continue;
      }
      if ("routes" in route) {
        this._router.use(
          route.path,
          ...guards,
          new zRouter(route.routes).router,
        );
        continue;
      }
    }
  }
}

export function z_provideRoutes(routes: zRoutes) {
  return new zRouter(routes);
}
