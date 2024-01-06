import { Injectable, TApp, zAnyEnv } from "../app/app.types.js";
import { isLogger } from "../utils/logger/logger.utils.js";
import { zLogger } from "../utils/logger/logger.types.js";
import {
  TDIModule,
  TModuleMap,
  TModuleType,
  TProvider,
} from "./module.types.js";

export abstract class zModule<Z extends zAnyEnv = NonNullable<zAnyEnv>>
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
  protected readonly _modules: TModuleMap<Z> = new Map();

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

  constructor() {
    const provided = this.constructor.prototype["__provided"];

    if (provided) {
      if (Array.isArray(provided)) {
        for (const provider of provided) this.provide(provider);
      } else {
        this.provide(provided);
      }
    }
  }

  protected provide<M extends zModule<Z>>(module: TProvider<Z, M>): M {
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
        const instance = module.factory();
        this._modules.set(module.module, instance);
        if (isLogger(instance)) this._logger = instance;
        if (this.initialized) instance.__init(this);
        return instance;
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

  protected _require<M extends zModule<Z>>(module: TModuleType<Z, M>): M {
    const instance = <M>this._modules.get(module);
    if (!instance) {
      const inherited = this.parent?.require(module);
      if (inherited) return inherited;

      throw new Error(`Module ${module.name} is not provided`);
    }

    return instance;
  }

  public require<M extends zModule<Z>>(module: TModuleType<Z, M>): M {
    const instance = this._require(module);
    if (this.initialized) instance.__init(this);
    if (this.ready) instance.__ready();
    if (this.started) instance.__start();

    return instance;
  }

  public inject<M extends zModule<Z>>(
    token: Injectable,
    module: TProvider<Z, M>,
  ): M {
    const instance = this.provide(module);
    instance._token = token;
    return instance;
  }
  public injectable<T extends zModule<Z>>(token: Injectable): T | undefined {
    for (const module of this._modules.values()) {
      if (module._token === token) return module as T;
    }

    return this.parent?.injectable<T>(token);
  }

  public onInit?: () => Promise<void> | void;
  protected async __init(parent?: zModule<Z>): Promise<void> {
    if (this._initialized) return;

    this.parent = parent;
    for (const module of this._modules.values()) {
      await module.__init(this);
    }

    if (this.onInit) await this.onInit();
    this._initialized = true;
  }

  public onReady?: () => Promise<void> | void;
  protected async __ready(): Promise<void> {
    if (this.ready) return;

    for (const module of this._modules.values()) {
      await module.__ready();
    }

    if (this.onReady) await this.onReady();
    this._ready = true;
  }

  public onStart?: () => Promise<void> | void;
  protected async __start(): Promise<void> {
    if (this.started) return;

    for (const module of this._modules.values()) {
      await module.__start();
    }

    if (this.onStart) await this.onStart();
    this._started = true;
  }

  public onDestroy?: () => Promise<void> | void;
  protected async __destroy(): Promise<void> {
    for (const module of this._modules.values()) {
      await module.__destroy();
    }

    if (this.onDestroy) await this.onDestroy();
  }
}
