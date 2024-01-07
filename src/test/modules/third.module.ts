import { Module } from "../../public-api.js";

export class ExampleModule3 extends Module {
  name: string = "Test 3";

  onInit = () => {
    this.logger.log("Service 3 initialized");
  };

  onReady = () => {
    this.logger.log("Service 3 ready");
  };

  onStart = () => {
    this.logger.log("Service 3 started");
  };
}
