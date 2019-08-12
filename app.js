'use strict';

const SlsTransport = require('./lib/transport');

/**
 * @param {egg.Application} app
 */
module.exports = app => {
  const loggerSlsProConfig = app.config.loggerSlsPro;
  app.getLogger('logger').set('sls', new SlsTransport(loggerSlsProConfig));
};
