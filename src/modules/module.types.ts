import { Injectable, zAnyEnv } from "../app/app.types.js";
import { zModule } from "./module.class.js";

export interface TDIModule {
  initialized: boolean;
  ready: boolean;
  started: boolean;

  onInit?(): Promise<void> | void;
  onReady?(): Promise<void> | void;
  onStart?(): Promise<void> | void;
  onDestroy?(): Promise<void> | void;
}

export interface TModuleType<Z extends zAnyEnv, K extends zModule<Z>> {
  new (): K;
}

export interface TModuleProvider<Z extends zAnyEnv, K extends zModule<Z>> {
  module: TModuleType<Z, K>;
}

export type TValueProvider<
  Z extends zAnyEnv,
  K extends zModule<Z>,
> = TModuleProvider<Z, K> & {
  value: K;
};

export type TModuleFactory<Z extends zAnyEnv, K extends zModule<Z>> = () =>
  | Promise<K>
  | K;

export type TFactoryProvider<
  Z extends zAnyEnv,
  K extends zModule<Z>,
> = TModuleProvider<Z, K> & {
  factory: TModuleFactory<Z, K>;
};

export type TClassProvider<
  Z extends zAnyEnv,
  K extends zModule<Z>,
> = TModuleProvider<Z, K> & {
  class: TModuleType<Z, K>;
};

export type TProvider<Z extends zAnyEnv, K extends zModule<Z>> =
  | TModuleType<Z, K>
  | TModuleProvider<Z, K>
  | TValueProvider<Z, K>
  | TFactoryProvider<Z, K>
  | TClassProvider<Z, K>;

export type TAnyProvider = TProvider<zAnyEnv, zModule<zAnyEnv>>;
export type TAnyProviders = TAnyProvider[];

export type TModuleMap<Z extends zAnyEnv> = Map<
  TModuleType<Z, zModule<Z>>,
  zModule<Z>
>;

export type TInjectableFactory<Z extends zAnyEnv> = {
  factory: TModuleFactory<Z, zModule<Z>>;
  token: Injectable;
};

export type TModuleMap2<Z extends zAnyEnv> = Map<
  TModuleType<Z, zModule<Z>>,
  zModule<Z> | TInjectableFactory<Z>
>;
