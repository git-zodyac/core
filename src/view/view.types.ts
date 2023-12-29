/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint, zServiceShape } from '../service/service.types.js';
import { Response } from 'express';
import { ZodType, z } from 'zod';

export type TViewEndpoint<T, TArgs extends Array<any> = any[]> = (
  res: Response<T>,
  ...args: TArgs
) => Response<T>;

export type TView<Z extends zServiceShape> = {
  [Key in keyof Z]: TViewEndpoint<TViewResponse<Z, Key>>;
};

export type ExtractZodType<Z> = Z extends ZodType ? z.infer<Z> : unknown;

export type TViewRes<Obj> = Obj extends { response: infer ZRes }
  ? ExtractZodType<ZRes>
  : unknown;

export type TViewResponse<
  Z extends zServiceShape,
  Key extends keyof Z,
> = TViewRes<Z[Key]>;

export function zView<
  Obj extends zServiceShape[string],
  TArgs extends Array<any>,
>(
  schema: Obj,
  handler: TViewEndpoint<TViewRes<Obj>, TArgs>,
): TViewEndpoint<TViewRes<Obj>, TArgs> {
  return handler;
}

export function zViewAny(hadler: Endpoint): Endpoint {
  return hadler;
}
