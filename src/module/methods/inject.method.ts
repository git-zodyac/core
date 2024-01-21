/* eslint-disable @typescript-eslint/no-explicit-any */
import { zModule, zModuleType } from "../module.types.js";
import { zError } from "../../errors/errors.js";

export function __Inject__<T extends zModule>(source: zModuleType<T>) {
  return function <K extends zModule>(module: zModuleType<K>): K {
    const injectable = source.prototype;

    if (!injectable.__instances)
      return zError.of("incorrect").throw(source.name);

    const flat = injectable.__instances.get(module);
    if (flat) return <K>flat;

    const parent = injectable.__parent;
    if (!parent) return zError.of("notProvided").throw(module.name);
    if (!parent.prototype.__inject)
      return zError.of("incorrect").throw(parent.name);

    return <K>parent.prototype.__inject(module);
  };
}
