import { Injectable, TApp, zAnyEnv } from "../app/app.types.js";
import { isLogger } from "../utils/logger/logger.utils.js";
import { zLogger } from "../utils/logger/logger.types.js";
import {
  TDIModule,
  TModuleFactory,
  TModuleMap2,
  TModuleType,
  TProvider,
} from "./module.types.js";

export abstract class zModule<Z extends zAnyEnv = zAnyEnv> // NonNullable<zAnyEnv>>
  implements TDIModule
{
  protected _token?: Injectable;
  public get token(): Injectable | undefined {
    return this._token;
  }

  protected get app(): TApp<Z> {
    return this.parent!.app;
  }

  protected parent?: zModule<Z>;
  protected readonly _modules: TModuleMap2<Z> = new Map();

  protected _initialized: boolean = false;
  public get initialized(): boolean {
    return this._initialized;
  }

  protected _ready: boolean = false;
  public get ready(): boolean {
    return this._ready;
  }

  protected _started: boolean = false;
  public get started(): boolean {
    return this._started;
  }
  protected _logger?: zLogger;
  public get logger(): zLogger {
    return this._logger ?? this.parent?.logger ?? this.app.logger;
  }

  // protected __required?: {
  //   module: TModuleType<Z, zModule<Z>>;
  //   propertyKey: string;
  // }[];

  constructor() {
    const provided = this.constructor.prototype["__provided"];

    if (provided) {
      for (const provider of provided) this.provide(provider);
    }
  }

  protected provide<M extends zModule<Z>>(
    module: TProvider<Z, M>,
  ): M | TModuleFactory<Z, M> {
    if ("module" in module) {
      if (this._modules.has(module.module)) {
        throw new Error(`Module ${module.module.name} is already provided`);
      }

      if ("value" in module) {
        const instance = module.value;
        this._modules.set(module.module, instance);
        if (isLogger(instance)) this._logger = instance;
        if (this.initialized) instance.__init(this);
        return instance;
      }

      if ("factory" in module) {
        this._modules.set(module.module, {
          token: module.module.name,
          factory: module.factory,
        });
        return module.factory;
      }

      if ("class" in module) {
        const instance = new module.class();
        this._modules.set(module.module, instance);
        if (isLogger(instance)) this._logger = instance;
        if (this.initialized) instance.__init(this);
        return instance;
      }

      const instance = new module.module();
      this._modules.set(module.module, instance);
      if (isLogger(instance)) this._logger = instance;
      if (this.initialized) instance.__init(this);
      return instance;
    }

    if (this._modules.has(module)) {
      throw new Error(`Module ${module.name} is already provided`);
    }

    const instance = new module();
    this._modules.set(module, instance);
    if (isLogger(instance)) this._logger = instance;
    if (this.initialized) instance.__init(this);
    return instance;
  }

  protected async _require<M extends zModule<Z>>(
    type: TModuleType<Z, M>,
  ): Promise<M> {
    const module = this._modules.get(type);
    if (!module) {
      const inherited = this.parent?._require(type);
      if (inherited) return inherited;

      throw new Error(`Module ${type.name} is not provided`);
    }

    if ("factory" in module) {
      const instance = await module.factory();
      this._modules.set(type, instance);
      return <M>instance;
    }

    return <M>module;
  }

  public async require<M extends zModule<Z>>(
    type: TModuleType<Z, M>,
  ): Promise<M> {
    const module = await this._require(type);
    if (this.initialized) await module.__init(this);
    if (this.ready) await module.__ready();
    if (this.started) await module.__start();

    return module;
  }

  public inject<M extends zModule<Z>>(
    token: Injectable,
    module: TProvider<Z, M>,
  ): M | TModuleFactory<Z, M> {
    if ("factory" in module) {
      const injector = {
        factory: module.factory,
        token,
      };
      this._modules.set(module.module, injector);
      return injector.factory;
    }
    const instance = <M>this.provide(module);
    instance._token = token;
    return instance;
  }

  public injectable<T extends zModule<Z>>(
    token: Injectable,
  ): T | TModuleFactory<Z, zModule<Z>> | undefined {
    for (const module of this._modules.values()) {
      if ("factory" in module) {
        if (module.token === token) return module.factory;
        continue;
      }

      if (module._token === token) return module as T;
    }

    return this.parent?.injectable<T>(token);
  }

  public onInit?: () => Promise<void> | void;
  protected async __init(parent?: zModule<Z>): Promise<void> {
    if (this._initialized) return;

    this.parent = parent;
    for (const module of this._modules.values()) {
      if ("factory" in module) continue;
      await module.__init(this);
    }

    const required: {
      module: TModuleType<Z, zModule<Z>>;
      propertyKey: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }[] = (<any>this)["__required"];

    if (required) {
      for (const dec of required) {
        const module = await this._require(dec.module);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (<any>this)[dec.propertyKey] = module;
      }
    }

    if (this.onInit) await this.onInit();
    this._initialized = true;
  }

  public onReady?: () => Promise<void> | void;
  protected async __ready(): Promise<void> {
    if (this.ready) return;

    for (const module of this._modules.values()) {
      if ("factory" in module) continue;
      await module.__ready();
    }

    if (this.onReady) await this.onReady();
    this._ready = true;
  }

  public onStart?: () => Promise<void> | void;
  protected async __start(): Promise<void> {
    if (this.started) return;

    for (const module of this._modules.values()) {
      if ("factory" in module) continue;
      await module.__start();
    }

    if (this.onStart) await this.onStart();
    this._started = true;
  }

  public onDestroy?: () => Promise<void> | void;
  protected async __destroy(): Promise<void> {
    for (const module of this._modules.values()) {
      if ("factory" in module) continue;
      await module.__destroy();
    }

    if (this.onDestroy) await this.onDestroy();
  }
}
