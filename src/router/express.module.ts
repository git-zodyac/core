import express, { Application } from 'express';
import { INJECTION_TOKEN, zAnyEnv } from '../app/app.types.js';
import { zModule } from '../modules/module.class.js';
import { TProvider } from '../modules/module.types.js';
import { zRouter } from './router.module.js';
import { zRoutes } from './router.types.js';

export class zExpressApp extends zModule {
  protected readonly _token = INJECTION_TOKEN.express;
  protected readonly express: Application = express();

  useRoutes(routes: zRoutes): zExpressApp {
    this.express.use(new zRouter(routes).router);
    return this;
  }

  useRouter(router: zRouter): zExpressApp {
    this.express.use(router.router);
    return this;
  }

  public onInit = () => {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
  };

  public onReady = () => {
    this.express.listen(this.app.env.PORT, () => {
      this.logger.info(`Listening on port ${this.app.env.PORT}`);
    });
  };

  public static router(router: zRouter): TProvider<zAnyEnv, zExpressApp> {
    return {
      module: zExpressApp,
      factory: () => new zExpressApp().useRouter(router),
    };
  }

  public static routes(routes: zRoutes): TProvider<zAnyEnv, zExpressApp> {
    return {
      module: zExpressApp,
      factory: () => new zExpressApp().useRoutes(routes),
    };
  }
}
