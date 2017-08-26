import * as path from 'path';
import { nconf } from '../../lib/nconf';

import { AppRuntimeEnv, APP_NODE_ENV_DEFAULT, APP_NODE_PORT_DEFAULT, AppNodeEnv } from '../app-environment';

type ConfigOption = {
  type: string;
  file: string;
};

export class NodeAppConfig {
  constructor(public env?: AppRuntimeEnv) {
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
      .add('appenv', this.getConfigOption('app', env.NODE_ENV))
      .add('app', this.getConfigOption('app'));
  }

  private getConfigOption(type: string, env?: AppNodeEnv): ConfigOption {
    return {
      type: 'file',
      file: this.getConfigPath(type, env)
    };
  }

  private getConfigPath(type: string, env?: AppNodeEnv): string {
    let suffix = env ? `-${env}` : '';
    let filename = `${type}${suffix}.json`;
    return path.resolve(path.join(process.cwd(), 'config', filename));
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

export const AppConfig = new NodeAppConfig(process.env);
