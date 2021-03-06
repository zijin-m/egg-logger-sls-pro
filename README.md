# egg-logger-sls-pro

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-logger-sls-pro.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-logger-sls-pro
[travis-image]: https://img.shields.io/travis/eggjs/egg-logger-sls-pro.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-logger-sls-pro
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-logger-sls-pro.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-logger-sls-pro?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-logger-sls-pro.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-logger-sls-pro
[snyk-image]: https://snyk.io/test/npm/egg-logger-sls-pro/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-logger-sls-pro
[download-image]: https://img.shields.io/npm/dm/egg-logger-sls-pro.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-logger-sls-pro

<!--
Description here.
-->

## Description

1. egg 的[阿里云日志](https://help.aliyun.com/document_detail/48869.html?spm=a2c4g.11186623.6.544.1697729a3lm2ra)插件。
2. 基于 [aliyun sdk](https://github.com/aliyun-UED/aliyun-sdk-js/tree/master/samples/sls) 和 [egg-logger](https://github.com/eggjs/egg-logger)。

## Install

```bash
$ npm i egg-logger-sls-pro --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.loggerSlsPro = {
  enable: true,
  package: 'egg-logger-sls-pro'
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.loggerSlsPro = {
  level: 'INFO',
  flushInterval: 1000,
  maxBufferLength: 1000,
  sls: {
    topic: 'your-topic-name',
    accessKeyId: '在阿里云sls申请的 accessKeyId',
    secretAccessKey: '在阿里云sls申请的 secretAccessKey',
    // 根据你的 sls project所在地区选择填入
    // 北京：http://cn-beijing.log.aliyuncs.com
    // 杭州：http://cn-hangzhou.log.aliyuncs.com
    // 青岛：http://cn-qingdao.log.aliyuncs.com
    // 深圳：http://cn-shenzhen.log.aliyuncs.com

    // 注意：如果你是在 ECS 上连接 log，可以使用内网地址，速度快，没有带宽限制。
    // 北京：cn-hangzhou-intranet.log.aliyuncs.com
    // 杭州：cn-beijing-intranet.log.aliyuncs.com
    // 青岛：cn-qingdao-intranet.log.aliyuncs.com
    // 深圳：cn-shenzhen-intranet.log.aliyuncs.com
    endpoint: 'your-endpoint',
    //目前支持最新的 api 版本, 不需要修改
    apiVersion: '2015-06-01',
    project: 'your-project-name',
    logStore: 'your-logStore-name'
  }
};
```

### custom put msg content

your can set formatter fn in config to do this, just like

```
exports.loggerSlsPro = {
  sls: {
    // ...other config
    // your custom formatter
    formatter: (level, args, meta) {
    // your formatter code here
    // must return like this
      return {
        time: 1565615342, // unix sec
        contents: [
          {
            key: 'key',
            value: 'value'
          }
        ]}
      }
  }
}

```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

```js
// send a info message
ctx.logger.info('message');
// or
app.logger.info('message');
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
