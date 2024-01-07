import { Module, Provide } from "../../public-api.js";
import { ExampleModule } from "./first.module.js";
import { ExampleModule3 } from "./third.module.js";

@Provide(ExampleModule3)
export class ExampleModule2 extends Module {
  onInit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log("Service 2 initialized");
  };

  onReady = () => {
    const service = this.require(ExampleModule);
    const service3 = this.require(ExampleModule3);
    this.logger.log("Service 2 ready", service.data, service3.name);
  };

  onStart = () => {
    this.logger.log("Service 2 started");
  };
}
