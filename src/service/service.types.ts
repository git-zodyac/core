/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyZodObject, ZodType, z } from "zod";
import { TView } from "../view/view.types.js";
import { Request, Response } from "express";

export type zServiceShape = {
  readonly [x: string]: {
    readonly params?: AnyZodObject;
    readonly body?: AnyZodObject;
    readonly query?: AnyZodObject;
    readonly response?: ZodType;
  };
};

export type zServiceRequest<Obj extends zServiceShape[string]> = Request<
  Obj extends { params: AnyZodObject } ? z.infer<Obj["params"]> : any,
  Obj extends { response: ZodType } ? z.infer<Obj["response"]> : any,
  Obj extends { body: AnyZodObject } ? z.infer<Obj["body"]> : any,
  Obj extends { query: AnyZodObject } ? z.infer<Obj["query"]> : any
>;

export type zServiceResponse<Obj extends zServiceShape[string]> = Response<
  Obj extends { response: ZodType } ? z.infer<Obj["response"]> : any
>;

export type zServiceHandler<Obj extends zServiceShape[string]> = (
  req: zServiceRequest<Obj>,
  res: zServiceResponse<Obj>,
) => zServiceResponse<Obj>;

export type TService<Z extends zServiceShape> = {
  [x in keyof Z]: zServiceHandler<Z[x]>;
} & { _view: TView<Z> };
