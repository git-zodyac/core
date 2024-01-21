import { zModule, zModuleType, zModuleConstructor } from "../module.types.js";
import { Provider } from "../provider.types.js";

export function assertModule<T extends zModule>(
  source: zModuleType<T>,
): asserts source is zModuleConstructor<T> {
  const injectable = source.prototype;
  injectable.__weight = 1;
  injectable.__token = Symbol(source.name);
  injectable.__providers = new Map<zModuleType<zModule>, Provider>();
  injectable.__instances = new Map<zModuleType<zModule>, zModule | null>();
  injectable.__parent = null;
}
