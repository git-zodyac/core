import { Module } from "../../public-api.js";

export class FourthModule extends Module {
  public onInit = () => {
    this.logger.info("Fourth module init");
  };
  public onReady = () => {
    this.logger.info("Fourth module ready");
  };
  public onStart = () => {
    this.logger.info("Fourth module start");
  };
  public onDestroy = () => {
    this.logger.info("Fourth module destroy");
  };
}
