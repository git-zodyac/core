import { app } from './app.module.js';

app.onInit = () => {
  app.logger.log('App initialized');
};
app.onReady = () => {
  app.logger.log('App ready');
};
app.onStart = () => {
  app.logger.info('App started');
};

app.start();
