import { Request, Response, NextFunction } from "express";
import { zServiceShape } from "../service/service.types.js";
import { AnyZodObject, z } from "zod";

export type zGuard<Obj extends zServiceShape[string]> = Guard<
  Obj extends { body: AnyZodObject } ? z.infer<Obj["body"]> : unknown,
  Obj extends { params: AnyZodObject } ? z.infer<Obj["params"]> : unknown,
  Obj extends { query: AnyZodObject } ? z.infer<Obj["query"]> : unknown
>;
export type Guard<Body = unknown, Params = unknown, Query = unknown> = (
  req: Request<Params, unknown, Body, Query>,
  res: Response,
) => boolean;

export function zGuardToMiddleware(guard: Guard) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (guard(req, res)) return next();
  };
}

export function zGuard<Obj extends zServiceShape[string]>(
  schema: Obj,
  guard: zGuard<Obj>,
): zGuard<Obj> {
  return guard;
}
