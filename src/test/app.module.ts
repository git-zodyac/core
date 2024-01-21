import { Env, Logger, Module, Inject } from "../public-api.js";
import { SecondModule } from "./modules/second.module.js";
import { ThirdModule } from "./modules/third.module.js";
import { Environment } from "./env.z.js";

@Module({
  providers: [ThirdModule],
})
export class AppModule {
  @Inject() third!: ThirdModule;
  @Env() env!: Environment;

  constructor(
    private second: SecondModule,
    private logger: Logger,
  ) {
    this.logger.info("Application:", second.data);
  }

  onInit() {
    console.log("💬", this.third.data);
    this.logger.info("Environment:", this.env?.PORT);
    this.logger.info("AppModule init!");
  }

  onReady() {
    this.logger.info("AppModule ready!");
  }

  onStart() {
    this.logger.info("AppModule start!");
  }

  onStop() {
    this.logger.error("AppModule stop!");
  }
}
