import { app } from "./app.module.js";

app.start();

app.onInit = () => {
  app.logger.info("App init");
};

app.onReady = () => {
  app.logger.info("App ready");
};

app.onStart = () => {
  app.logger.info("App start");
};

app.onDestroy = () => {
  app.logger.info("App destroy");
};

setTimeout(() => app.stop(), 5000);
