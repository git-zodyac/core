import { Colors } from "../utils/logger/colors.js";
import { RootProvider } from "../global/global.provider.js";
import { __Inject__ } from "./methods/inject.method.js";
import { __Create__ } from "./methods/lifecycle.method.js";
import { __Provide__ } from "./methods/provide.method.js";
import { assertModule } from "./methods/initialize.method.js";
import { ModuleConfig, RootModuleConfig } from "./provider.types.js";
import { zModule, zModuleType } from "./module.types.js";
import { zError } from "../errors/errors.js";
import "reflect-metadata";

/**
 * Module decorator
 * @param config Module config:
 * - inRoot: boolean - inject Module globally
 * - providers: ModuleConstructor[] - Module classes to inject
 */
export const Module = (config?: ModuleConfig) => __Module__(config);

/**
 * Root Module decorator.
 * This module will be injected globally.
 * @param config Module config:
 * - providers: ModuleConstructor[] - Module classes to inject
 */
export const RootModule = (config?: RootModuleConfig) =>
  __Module__({
    inRoot: true,
    providers: config?.providers,
  });

/**
 * Leaf Module decorator.
 * This module will not have any descendants.
 * @param config Module config:
 * - providers: ModuleConstructor[] - Module classes to inject
 */
export const LeafModule = (config?: { inRoot: boolean }) => __Module__(config);

function __Module__(config?: ModuleConfig) {
  return function <T extends zModule>(source: zModuleType<T>) {
    try {
      const module = source.prototype;
      const params = Reflect.getMetadata("design:paramtypes", source);

      // Set module initial data
      assertModule(source);

      // Set module methods
      module.__inject = __Inject__(source);
      module.__create = __Create__(source);
      module.__provide = __Provide__(source);

      if (params) {
        for (const param of params) {
          if (param.prototype.__token === undefined) {
            return zError.of("constructorSus").throw(source.name, param.name);
          }

          if (!param.prototype.__weight) param.prototype.__weight = 1;
          else param.prototype.__weight++;

          console.log("Requires", param.name, param.prototype.__weight);
        }
      }

      if (module.__requires) {
        for (const target of module.__requires) {
          console.log("Requires", target);

          if (!target.from.prototype.__token)
            return zError.of("notModule").throw(target.from.name);

          if (!target.from.prototype.__weight)
            target.from.prototype.__weight = 1;
          target.from.prototype.__weight++;
        }
      }

      // Set module providers
      for (const provider of config?.providers ?? [])
        module.__provide(provider);

      if (config?.inRoot) RootProvider.modules.push(source);
    } catch (error) {
      console.error(Colors.red("❗️ Zodyac Core"), error);
      process.exit(1);
    }
  };
}
