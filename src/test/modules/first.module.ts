import { Module } from "../../public-api.js";
import { zAppEnv } from "../env.js";
import { SecondModule } from "./second.module.js";

export class FirstModule extends Module<zAppEnv> {
  second!: SecondModule;

  public onInit = async () => {
    this.logger.info("First module init");
    this.second = await this.require(SecondModule);
  };
  public onReady = async () => {
    this.logger.info("First module ready");
    this.logger.info(this.second?.data);
  };
  public onStart = () => {
    this.logger.info("First module start");
  };
  public onDestroy = () => {
    this.logger.info("First module destroy");
  };
}
