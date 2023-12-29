/* eslint-disable @typescript-eslint/no-explicit-any */
import { TView } from '../view/view.types.js';
import { AnyZodObject, ZodType, z } from 'zod';
import { Request, Response } from 'express';

export type zServiceShape = {
  readonly [x: string]: {
    readonly params?: AnyZodObject;
    readonly body?: AnyZodObject;
    readonly query?: AnyZodObject;
    readonly response?: ZodType;
  };
};

export type Endpoint<
  Body = unknown,
  Params = unknown,
  Query = unknown,
  TRes = unknown,
> = (
  req: Request<Params, TRes, Body, Query>,
  res: Response<TRes>,
) => Response<TRes>;

export type TService<Z extends zServiceShape> = {
  [x in keyof Z]: Endpoint<
    Z[x] extends { body: AnyZodObject } ? z.infer<Z[x]['body']> : unknown,
    Z[x] extends { params: AnyZodObject } ? z.infer<Z[x]['params']> : any,
    Z[x] extends { query: AnyZodObject } ? z.infer<Z[x]['query']> : any,
    Z[x] extends { response: ZodType } ? z.infer<Z[x]['response']> : unknown
  >;
} & { _view: TView<Z> };
