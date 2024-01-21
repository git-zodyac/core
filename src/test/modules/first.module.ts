import { Module } from "../../public-api.js";

@Module()
export class FirstModule {
  data: string = "Hello, " + Math.random();

  constructor() {}

  // onInit() {
  //   console.log('FirstModule init!');
  // }

  // onReady() {
  //   console.log('FirstModule ready!');
  // }

  // onStart() {
  //   console.log('FirstModule start!');
  // }

  // onStop() {
  //   console.log('FirstModule stop!');
  // }
}

export const first = new FirstModule();
export const first_factory = async () => new FirstModule();
