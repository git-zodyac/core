import { Module, Require } from "../../public-api.js";
import { zAppEnv } from "../env.js";
import { SecondModule } from "./second.module.js";

export class FirstModule extends Module<zAppEnv> {
  @Require(SecondModule)
  second!: SecondModule;

  public onInit = async () => {
    this.logger.info("First module init");
    this.logger.info("OnInit: Given data:", this.second.data);
  };
  public onReady = async () => {
    this.logger.info("First module ready");
    this.logger.info("OnReady: Given data:", this.second.data);
  };
  public onStart = () => {
    this.logger.info("First module start");
  };
  public onDestroy = () => {
    this.logger.info("First module destroy");
  };
}
