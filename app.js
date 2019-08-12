'use strict';

const SlsTransport = require('./lib/transport');

/**
 * @param {egg.Application} app
 */
module.exports = app => {
  const loggerSlsConfig = app.config.loggerSls;
  app.getLogger('logger').set('sls', new SlsTransport(loggerSlsConfig));
};
