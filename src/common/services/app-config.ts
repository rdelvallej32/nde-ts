import * as path from 'path';
import { nconf } from '../../lib/nconf';

import { AppRuntimeEnv, APP_NODE_ENV_DEFAULT, APP_NODE_PORT_DEFAULT, AppNodeEnv } from '../app-environment';

const CONFIG_TYPES = {
  app: 'app',
  pkgMdle: 'nde-ts'
};

type ConfigOption = {
  type: string;
  file: string;
};

export class NodeAppConfig {
  public static init(env?: AppRuntimeEnv): NodeAppConfig {
    nconf.reset();
    nconf.remove('base');

    return new NodeAppConfig(env || process.env);
  }

  constructor(public env: AppRuntimeEnv) {
    const pkg: Object = require(path.join(process.cwd(), 'package.json'));
    const appEnv = {
      NODE_ENV:  env.NODE_ENV || APP_NODE_ENV_DEFAULT,
      PORT: env.PORT || APP_NODE_PORT_DEFAULT
    };

    nconf.argv()
      .add('base', {type: 'literal', store: {
        env: appEnv,
        package: pkg
      }})
      .add('appenv', this.getConfigOption(CONFIG_TYPES.app, appEnv.NODE_ENV))
      .add('app', this.getConfigOption(CONFIG_TYPES.app))
      .add('nde-ts-env', this.getConfigOption(CONFIG_TYPES.pkgMdle, appEnv.NODE_ENV))
      .add('nde-ts', this.getConfigOption(CONFIG_TYPES.pkgMdle));
  }

  private getConfigOption(type: string, env?: AppNodeEnv): ConfigOption {
    return {
      type: 'file',
      file: this.getConfigPath(type, env)
    };
  }

  private getConfigPath(type: string, env?: AppNodeEnv): string {
    const suffix = env ? `-${env}` : '';
    const filename = `${type}${suffix}.json`;
    let configPath: string;

    switch (type) {
      case CONFIG_TYPES.pkgMdle:
        configPath = path.join(__dirname, '../../../config', filename);
        break;
      case CONFIG_TYPES.app:
        configPath = path.resolve(path.join(process.cwd(), 'config', filename));
    }

    return path.resolve(configPath);
  }

  public get(key?: string): any {
    return nconf.get(key);
  }

  // Only if there are key values to be added outside of package.json
  public set(key: string, value: string): void {
    nconf.set(key, value);
  }

  public getEnvironment(): AppNodeEnv {
    return this.get('env:NODE_ENV');
  }

  public isProd(): boolean {
    return (/prod/).test(this.getEnvironment());
  }
}

export const AppConfig = NodeAppConfig.init();
