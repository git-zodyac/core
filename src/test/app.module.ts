import { ExampleModule } from "./modules/first.module.js";
import { App, ExpressApp } from "../public-api.js";
import { routes } from "./app.router.js";
import { zEnv } from "./env.z.js";

export const app = new App({
  env: zEnv,
  providers: [ExampleModule, ExpressApp.routes(routes)],
});
