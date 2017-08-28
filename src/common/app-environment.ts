export type AppNodeEnv = 'development' | 'test' | 'prod';

export const APP_NODE_ENV_DEFAULT: AppNodeEnv = 'development';
export const APP_NODE_PORT_DEFAULT = 3000;

export type AppRuntimeEnv = {
  NODE_ENV?: AppNodeEnv;
  PORT?: number;
  VOLUME_LOG?: string;
};
