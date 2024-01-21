/* eslint-disable @typescript-eslint/no-explicit-any */
import { zModule, zModuleType, zInstanceProto } from "../module.types.js";
import { zError } from "../../errors/errors.js";

export function createLifecycle<T extends zModule>(
  source: zModuleType<T>,
  instance: T,
): T {
  const injectable = source.prototype;
  const proto: zInstanceProto = {
    __source: source,

    __isInit: false,
    __init: async function () {
      if (proto!.__isInit) return;

      if (!injectable.__instances)
        return zError.of("incorrect").throw(source.name);

      for (const [key, provider] of injectable.__instances) {
        if (!provider) return zError.of("notProvided").throw(key.name);
        if (!provider.prototype?.__init)
          return zError.of("incorrect").throw(key.name);

        await provider.prototype.__init();
      }

      if ("onInit" in instance) await instance.onInit();

      await proto.__ready();

      proto.__isInit = true;
    },

    __isReady: false,
    __ready: async function () {
      if (proto!.__isReady) return;

      if (!injectable.__instances)
        return zError.of("incorrect").throw(source.name);

      for (const [key, provider] of injectable.__instances!) {
        if (!provider) return zError.of("notProvided").throw(key.name);
        if (!provider.prototype?.__ready)
          return zError.of("incorrect").throw(key.name);

        await provider.prototype!.__ready!();
      }

      if ("onReady" in instance) await instance.onReady();

      await proto.__start!();

      proto.__isReady = true;
    },

    __isStarted: false,
    __start: async function () {
      if (proto!.__isStarted) return;

      if (!injectable.__instances)
        return zError.of("incorrect").throw(source.name);

      for (const [key, provider] of injectable.__instances!) {
        if (!provider) return zError.of("notProvided").throw(key.name);
        if (!provider.prototype?.__start)
          return zError.of("incorrect").throw(key.name);

        await provider.prototype.__start();
      }

      if ("onStart" in instance) await instance.onStart();

      proto.__isStarted = true;
    },

    __isStopped: false,
    __stop: async function () {
      if (proto!.__isStopped) return;

      if (!injectable.__instances)
        return zError.of("incorrect").throw(source.name);

      for (const [key, provider] of injectable.__instances!) {
        if (!provider) return zError.of("notProvided").throw(key.name);
        if (!provider.prototype?.__stop)
          return zError.of("incorrect").throw(key.name);

        await provider.prototype.__stop();
      }

      if ("onStop" in instance) await instance.onStop();

      proto.__isStopped = true;
    },
  };

  instance.prototype = proto;
  return instance;
}

export async function createInstance<T extends zModule>(
  source: zModuleType<T>,
): Promise<T> {
  const module = source.prototype;
  const params = Reflect.getMetadata("design:paramtypes", source);

  if (!module.__providers) return zError.of("incorrect").throw(source.name);
  if (!module.__instances) return zError.of("incorrect").throw(source.name);
  if (!module.__inject) return zError.of("incorrect").throw(source.name);

  const providables = Array.from(module.__providers.keys());
  providables.sort((a, b) => b.prototype.__weight! - a.prototype.__weight!);

  for (const ref of providables!) {
    const provider = module.__providers.get(ref);
    if (!provider) return zError.of("notProvided").throw(ref.name);

    let instance;
    switch (true) {
      case "useValue" in provider:
        instance = provider.useValue;
        createLifecycle(ref, instance);
        break;
      case "useClass" in provider:
        if (!provider.useClass.prototype.__create)
          return zError.of("incorrect").throw(provider.useClass.name);

        instance = await provider.useClass.prototype.__create();
        break;
      case "factory" in provider:
        instance = await provider.factory();
        createLifecycle(ref, instance);
        break;
      default:
        if (!ref.prototype.__create)
          return zError.of("incorrect").throw(provider.name);

        instance = await ref.prototype.__create();
    }

    module.__instances.set(ref, instance);
  }

  let instance: T;

  if (!params) instance = new source();
  else {
    const args = params.map((param: zModuleType) => module.__inject!(param));
    instance = new source(...args);
  }

  if (module.__requires) {
    for (const target of module.__requires) {
      const injection = module.__inject(target.from);

      if (target.read) {
        if (!(target.read in injection))
          return zError.of("noField").throw(target.read, target.from.name);
        (<any>instance)[target.key] = (<any>injection)[target.read];
      } else {
        (<any>instance)[target.key] = injection;
      }
    }
  }

  return instance;
}

export function __Create__<T extends zModule>(source: zModuleType<T>) {
  return async function (): Promise<T> {
    const instance = await createInstance(source);
    return createLifecycle(source, instance);
  };
}
