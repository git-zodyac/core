import { zAppEnv } from "../env.js";
import { Module } from "../../public-api.js";

export class ThirdModule extends Module<zAppEnv> {
  constructor() {
    super();
  }

  public onInit = () => {
    this.logger.info("Third module init");
  };

  public onReady = () => {
    this.logger.info("Third module ready");
  };

  public onStart = () => {
    this.logger.info("Third module start");
  };

  public onDestroy = () => {
    this.logger.info("Third module destroy");
  };
}
