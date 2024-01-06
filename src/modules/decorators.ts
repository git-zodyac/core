import { zAnyEnv } from "../app/app.types.js";
import { TProvider } from "./module.types.js";
import { zModule } from "./module.class.js";

export function zProvide<Z extends zAnyEnv, M extends zModule<Z>>(
  modules: TProvider<Z, M> | [TProvider<Z, M>, ...TProvider<Z, M>[]],
): ClassDecorator {
  return (target) => {
    target.prototype.__provided = modules;
    return;
  };
}
