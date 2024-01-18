/* eslint-disable @typescript-eslint/no-explicit-any */
import { zAnyEnv } from "../app/app.types.js";
import { TModuleType, TProvider } from "./module.types.js";
import { zModule } from "./module.class.js";

export function zProvide<Z extends zAnyEnv, M extends zModule<Z>>(
  modules: TProvider<Z, M> | [TProvider<Z, M>, ...TProvider<Z, M>[]],
): ClassDecorator {
  return (target) => {
    if (!target.prototype.__provided) target.prototype.__provided = [];
    if (Array.isArray(modules)) {
      target.prototype.__provided.push(...modules);
    } else {
      target.prototype.__provided.push(modules);
    }
    return;
  };
}

export function zRequire<Z extends zAnyEnv, M extends zModule<Z>>(
  module: TModuleType<Z, M>,
) {
  return function (target: any, propertyKey: string) {
    if (!target.__required) target.__required = [];
    target.__required.push({ module, propertyKey });
  };
}
