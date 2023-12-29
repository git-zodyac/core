import { INJECTION_TOKEN } from '../../app/app.types.js';
import { zLoggerModule } from './logger.module.js';
import { zModule } from '../../modules/module.class.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isLogger(module: zModule<any>): module is zLoggerModule {
  return module.token === INJECTION_TOKEN.logger;
}
