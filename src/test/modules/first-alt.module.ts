import { Module } from "../../public-api.js";

@Module()
export class FirstAlt {
  data: string = "Hello, alt, " + Math.random();
}
