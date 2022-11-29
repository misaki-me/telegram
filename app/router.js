'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const apiRouter = router.namespace('/api');

  apiRouter.post('/upload', controller.home.upload);

  apiRouter.get('/v2Ray', controller.home.v2Ray);

  apiRouter.get('/telegram', controller.home.telegram);

  apiRouter.get('/oicq', controller.home.oicq);

  apiRouter.get('/QQbot', controller.home.QQbot);

  apiRouter.get('/snedTestMessage', controller.home.snedTestMessage);
};
