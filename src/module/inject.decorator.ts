import { zModule, zModuleType } from "./module.types.js";

export interface InjectionParams<T extends zModule> {
  read: keyof T;
  from: zModuleType<T>;
}

/**
 * Inject decorator
 * Help injecting dependency into the class property.
 * Please do not use this decorator in module constructor.
 * Constructor handles dependencies differently.
 *
 * @example
 * ```ts
 * import { Inject, Module } from '@zodyac/core';
 * import { SomeModule } from '../some/some.module.js';
 *
 * \@Module()
 * export class MyModule {
 *   \@Inject()
 *   some!: SomeModule;
 * }
 * ```
 *
 * You can also specify the property to inject:
 *
 * ```ts
 * import { Inject, Module } from '@zodyac/core';
 * import { SomeModule } from '../some/some.module.js';
 *
 * \@Module()
 * export class MyModule {
 *   \@Inject({ read: 'some_property' })
 *   some!: SomeModule;
 * }
 * ```
 *
 * Notice: property is being injected only once and is not reactive by default.
 */
export function Inject<T extends zModule>(params?: InjectionParams<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string | symbol) {
    if (!target.__requires) target.__requires = [];

    if (params) {
      target.__requires.push({
        key: propertyKey,
        read: params.read,
        from: params.from,
      });
      return;
    } else {
      const arg = Reflect.getMetadata("design:type", target, propertyKey);
      if (!arg) return;

      target.__requires.push({
        key: propertyKey,
        from: arg,
      });
    }
  };
}
