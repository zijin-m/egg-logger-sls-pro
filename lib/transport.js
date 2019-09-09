'use strict';

const { Transport } = require('egg-logger');
const ALY = require('aliyun-sdk');
const os = require('os');
const util = require('util');
const assert = require('assert');
const R = require('ramda');

class SlsTransport extends Transport {
  constructor(options) {
    super(options);
    this._bufSize = 0;
    this._buf = [];
    this._timer = this._createInterval();
    this._client = null;
    this.sls = options.sls;
    assert(this.sls, 'should pass config.sls');
    assert(this.sls.accessKeyId, 'should pass config.sls.accessKeyId');
    assert(this.sls.secretAccessKey, 'should pass config.sls.secretAccessKey');
    assert(this.sls.endpoint, 'should pass config.sls.endpoint');
    assert(this.sls.project, 'should pass config.sls.project');
    assert(this.sls.logStore, 'should pass config.sls.logStore');
  }

  get client() {
    if (!this._client) {
      this._client = new ALY.SLS({
        accessKeyId: this.sls.accessKeyId,
        secretAccessKey: this.sls.secretAccessKey,
        endpoint: this.sls.endpoint,
        apiVersion: this.sls.apiVersion,
      });
    }
    return this._client;
  }

  get defaults() {
    return Object.assign(super.defaults, {
      flushInterval: 1000,
      maxBufferLength: 1000,
    });
  }

  _createInterval() {
    return setInterval(this.flush.bind(this), this.options.flushInterval);
  }

  _closeInterval() {
    clearInterval(this._timer);
    this._timer = null;
  }

  /**
   * output log, see {@link Transport#log}
   * @param  {String} level - log level
   * @param  {Array} args - all arguments
   * @param  {Object} meta - meta information
   */
  log(level, args, meta) {
    const format = this.sls.formatter || this._format;
    try {
      const msg = JSON.stringify(format(level, args, meta)) + this.options.eol;
      const buf = Buffer.from(msg);
      if (buf.length) {
        this._write(buf);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * override, save in memory temporary
   * @param {Buffer} buf - log buffer
   * @private
   */
  _write(buf) {
    this._bufSize += buf.length;
    this._buf.push(buf);
    if (this._buf.length > this.options.maxBufferLength) {
      this.flush();
    }
  }

  flush() {
    if (this._buf.length > 0) {
      let msg;
      if (this.options.encoding === 'utf8') {
        msg = this._buf.join('');
      } else {
        msg = Buffer.concat(this._buf, this._bufSize).toString();
      }
      this._putLogs(this._getJsonLogs(msg));
      this._buf = [];
      this._bufSize = 0;
    }
  }

  close() {
    this._closeInterval();
    super.close();
  }

  _putLogs(logs) {
    const opt = {
      projectName: this.sls.project,
      logStoreName: this.sls.logStore,
      logGroup: {
        logs,
        topic: this.sls.topic || this.sls.logStore, // optional
        source: this.hostName, // optional
      },
    };
    try {
      this.client.putLogs(opt, this._putLogCb.bind(this));
    } catch (error) {
      console.log(error);
    }
  }

  _putLogCb(err) {
    if (err) {
      throw err;
    }
  }

  _format(level, args, meta) {
    let contents = [
      {
        key: 'level',
        value: level,
      },
      {
        key: 'message',
        value: util.format(...args),
      },
    ];
    if (meta && meta.ctx) {
      const ctx = meta.ctx;
      contents = contents.concat([
        {
          key: 'env',
          value: R.pathOr(process.env.NODE_ENV, [ 'app', 'config', 'env' ], ctx),
        },
        {
          key: 'method',
          value: R.pathOr('-', [ 'request', 'method' ], ctx),
        },
        {
          key: 'status',
          value: R.pathOr('-', [ 'status' ], ctx).toString(),
        },
        {
          key: 'url',
          value: R.pathOr('-', [ 'request', 'url' ], ctx),
        },
        {
          key: 'traceId',
          value: R.pathOr('-', [ 'tracer', 'traceId' ], ctx).toString(),
        },
        {
          key: 'userId',
          value: R.pathOr('-', [ 'userId' ], ctx).toString(),
        },
        {
          key: 'x-session-id',
          value: R.pathOr('-', [ 'header', 'x-session-id' ], ctx).toString(),
        },
        {
          key: 'header',
          value: JSON.stringify(R.pathOr('-', [ 'header' ], ctx)),
        },
        {
          key: 'request',
          value: JSON.stringify(R.pathOr('-', [ 'request', 'body' ], ctx)),
        },
        {
          key: 'response',
          value: (ctx.body && JSON.stringify(ctx.body)) || '-',
        },
      ]);
    }
    return {
      time: Math.floor(new Date().getTime() / 1000), // 单位秒
      contents,
    };
  }

  _getJsonLogs(msg) {
    return msg
      .split(this.options.eol)
      .filter(msg => msg)
      .map(msg => JSON.parse(msg));
  }

  get hostName() {
    return os.hostname();
  }
}

module.exports = SlsTransport;
