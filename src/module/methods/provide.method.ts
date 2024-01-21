import { zModule, zModuleType } from "../module.types.js";
import { Provider } from "../provider.types.js";
import { zError } from "../../errors/errors.js";

export function __Provide__<T extends zModule>(source: zModuleType<T>) {
  return function <K extends zModule>(provider: Provider<K>): void {
    const injectable = source.prototype;

    if (!injectable.__providers)
      return zError.of("incorrect").throw(source.name);
    if (!injectable.__instances)
      return zError.of("incorrect").throw(source.name);

    const target = "provide" in provider ? provider.provide : provider;
    if (injectable.__providers.has(target))
      return zError.of("doubleProvide").throw(target.name);

    target.prototype.__parent = source;
    injectable.__providers.set(target, provider);
    injectable.__instances.set(target, null);
  };
}
