'use strict';

/**
 * egg-logger-sls-pro default config
 * @member Config#loggerSls
 * @property {String} SOME_KEY - some description
 */
exports.loggerSlsPro = {
  level: 'INFO',
  flushInterval: 1000,
  maxBufferLength: 1000,
  eol: '#end#',
  sls: {
    topic: '',
    accessKeyId: '',
    secretAccessKey: '',
    endpoint: '',
    apiVersion: '2015-06-01',
    project: '',
    logStore: '',
  },
};
