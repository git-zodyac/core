import { Module } from "../../public-api.js";
import { zAppEnv } from "../env.js";
import { SecondModule } from "./second.module.js";

export class FirstModule extends Module<zAppEnv> {
  public onInit = () => {
    this.logger.info("First module init");
  };
  public onReady = async () => {
    this.logger.info("First module ready");
    const instance = await this.require(SecondModule);
    this.logger.info(instance.data);
  };
  public onStart = () => {
    this.logger.info("First module start");
  };
  public onDestroy = () => {
    this.logger.info("First module destroy");
  };
}
