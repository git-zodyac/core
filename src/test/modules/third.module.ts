import { Inject, Module } from "../../public-api.js";
// import { FirstAlt } from './first-alt.module.js';
import { FirstModule, first_factory } from "./first.module.js";
import { SecondModule } from "./second.module.js";

@Module({
  providers: [
    {
      provide: FirstModule,
      factory: first_factory,
    },
  ],
})
export class ThirdModule {
  data = "ThirdModule says hello!";

  @Inject({ read: "data", from: SecondModule })
  mod3!: string;

  constructor(
    private mod: FirstModule,
    // private mod2: SecondModule,
  ) {
    console.log("ThirdModule !", this.mod.data);
  }

  onInit() {
    console.log("ThirdModule init. Second: ", this.mod3);
  }

  // onReady() {
  //   console.log('ThirdModule ready!');
  // }

  // onStart() {
  //   console.log('ThirdModule start!');
  // }

  // onStop() {
  //   console.log('ThirdModule stop!');
  // }
}
