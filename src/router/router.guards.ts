import { zServiceShape } from "../service/service.types.js";
import { zModule } from "../modules/module.class.js";
import { Request, Response } from "express";
import { zAnyEnv } from "../public-api.js";
import { AnyZodObject, ZodType, z } from "zod";

export type zRequest<Obj extends zServiceShape[string]> = Request<
  Obj extends { params: AnyZodObject } ? z.infer<Obj["params"]> : unknown,
  Obj extends { response: ZodType } ? z.infer<Obj["response"]> : unknown,
  Obj extends { body: AnyZodObject } ? z.infer<Obj["body"]> : unknown,
  Obj extends { query: AnyZodObject } ? z.infer<Obj["query"]> : unknown
>;

export abstract class zGuard<
  Obj extends zServiceShape[string] = Record<string, never>,
  Z extends zAnyEnv = zAnyEnv,
> extends zModule<Z> {
  abstract canPass(req?: zRequest<Obj>, res?: Response): boolean;
}

export interface zGuardConstructor<
  Obj extends zServiceShape[string],
  Z extends zAnyEnv = zAnyEnv,
> {
  new (): zGuard<Obj, Z>;
}
