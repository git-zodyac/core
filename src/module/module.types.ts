import {
  EmptyModule,
  OnInit,
  OnReady,
  OnStart,
  OnStop,
} from "./lifecycle.types.js";
import { Provider } from "./provider.types.js";

export type zLifecycle = OnInit | OnReady | OnStart | OnStop | EmptyModule;

export type zLifecycleHook = () => Promise<void>;
export interface zInstanceProto {
  __source: zModuleType;

  __isInit: boolean;
  __init: zLifecycleHook;

  __isReady: boolean;
  __ready: zLifecycleHook;

  __isStarted: boolean;
  __start: zLifecycleHook;

  __isStopped: boolean;
  __stop: zLifecycleHook;
}

export interface zProto {
  prototype?: Partial<zInstanceProto>;
}

export type zModule = zProto & zLifecycle;

export interface zModuleType<T extends zModule = zModule> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: zModule & Partial<zModuleProto<T>>;
}

export interface zModuleConstructor<T extends zModule = zModule> {
  new (...args: zModule[]): T;
  prototype: zModule & zModuleProto<T>;
}

export type zProvidersMap = Map<zModuleType<zModule>, Provider>;
export type zInstanceMap = Map<zModuleType<zModule>, zModule | null>;

export interface zModuleRequire {
  key: string | symbol;
  read?: string | symbol;
  from: zModuleType;
}

export interface zModuleProto<T extends zModule = zModule> {
  // Module identifier
  __token: symbol; // <-- constructor.name

  // Dependency tree
  __parent: zModuleType | null;
  __providers: zProvidersMap;
  __instances: zInstanceMap;
  __weight: number;

  // Module methods
  __inject: <T extends zModule>(module: zModuleType<T>) => T;
  __provide: <T extends zModule>(provider: Provider<T>) => void;
  __create: () => Promise<T> | T;

  // Attribute injection
  __requires: zModuleRequire[];
}
