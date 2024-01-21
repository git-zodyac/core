import { Module } from "../../public-api.js";
import { FirstModule, first } from "./first.module.js";

@Module({
  inRoot: true,
  providers: [
    {
      provide: FirstModule,
      useValue: first,
    },
  ],
})
export class SecondModule {
  data: string = "Hello from second!";

  constructor(private mod: FirstModule) {
    console.log("SecondModule !", this.mod.data);
  }

  // onInit() {
  //   console.log('SecondModule init!');
  // }

  // onReady() {
  //   console.log('SecondModule ready!');
  // }

  // onStart() {
  //   console.log('SecondModule start!');
  // }

  // onStop() {
  //   console.log('SecondModule stop!');
  // }
}
