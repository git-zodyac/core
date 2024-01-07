import { FirstModule } from "./modules/first.module.js";
import { SecondModule } from "./modules/second.module.js";
import { ThirdModule } from "./modules/third.module.js";
import { App } from "../public-api.js";
import { zAppEnv } from "./env.js";

export const app = new App({
  env: zAppEnv,
  providers: [
    FirstModule,
    {
      module: SecondModule,
      factory: async () => new SecondModule(),
    },
    {
      module: ThirdModule,
      value: new ThirdModule(),
    },
  ],
});
