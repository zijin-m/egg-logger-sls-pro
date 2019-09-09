import 'egg';

declare module 'egg' {
  // 扩展你的配置
  interface EggAppConfig {
    loggerSlsPro: {
      level?: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
      flushInterval?: number;
      maxBufferLength?: number;
      sls: {
        topic?: string;
        accessKeyId: string;
        secretAccessKey: string;
        endpoint: string;
        apiVersion: string;
        project: string;
        logStore: string;
      };
    };
  }
}
