import { zModule, zModuleType } from "./module.types.js";

export type ModuleProvider<T extends zModule> = zModuleType<T>;
export interface ClassProvider<T extends zModule, K extends T> {
  provide: zModuleType<T>;
  useClass: zModuleType<K>;
}
export interface ValueProvider<T extends zModule> {
  provide: zModuleType<T>;
  useValue: T;
}
export interface FactoryProvider<T extends zModule> {
  provide: zModuleType<T>;
  factory: () => Promise<T> | T;
}

export type Provider<T extends zModule = zModule> =
  | ModuleProvider<T>
  | ClassProvider<T, T>
  | ValueProvider<T>
  | FactoryProvider<T>;

export interface ModuleProvidersConfig {
  providers?: Provider[];
}

export interface RootModuleConfig extends ModuleProvidersConfig {}

export interface ModuleConfig extends ModuleProvidersConfig {
  inRoot?: boolean;
}
