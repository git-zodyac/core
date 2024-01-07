import { zAppEnv } from "../env.js";
import { Module, Provide } from "../../public-api.js";
import { FourthModule } from "./fourth.module.js";

@Provide(FourthModule)
export class SecondModule extends Module<zAppEnv> {
  data = "some_data";

  constructor() {
    super();
    console.info("Third module constructor", Date.now());
  }

  public onInit = () => {
    this.logger.info("Second module init");
  };

  public onReady = () => {
    this.logger.info("Second module ready");
  };

  public onStart = () => {
    this.logger.info("Second module start");
  };

  public onDestroy = () => {
    this.logger.info("Second module destroy");
  };
}
