import { ExampleModule2 } from "./second.module.js";
import { Provide, Module } from "../../public-api.js";
import { zEnv } from "../env.z.js";

@Provide(ExampleModule2)
export class ExampleModule extends Module<typeof zEnv> {
  data!: string;

  onInit = () => {
    this.data = `Hello, ${this.app.env.some}!`;
    this.logger.log("Service 1 initialized");
  };

  onReady = () => {
    this.logger.log("Service 1 ready");
  };

  onStart = () => {
    this.logger.log("Service 1 started");
  };
}
