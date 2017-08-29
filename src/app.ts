/* tslint:disable:no-unused-expression */
import * as http from 'http';
import * as path from 'path';

import { express } from './lib/express';

import {
  AppDebug,
  AppHealth,
  AppParsers,
  AppSecurity
} from './common/middleware';
import { AppConfig, NodeAppConfig } from './common/services/app-config';

export interface NodeAppInterface {
  // initRouting(): void;
  serve(): http.Server;
}

export abstract class BaseApp implements NodeAppInterface {
  protected app: express.Express;
  protected config: NodeAppConfig = AppConfig;

  constructor() {
    this.app = express();
    this.initMiddleware();
  }

  public serve(): http.Server {
    return this.app.listen(AppConfig.get('env:PORT'), () => {
      console.log('%s v%s (%s) listening on port %d',
        AppConfig.get('package:name'),
        AppConfig.get('package:version'),
        AppConfig.get('env:NODE_ENV'),
        AppConfig.get('env:PORT')
      )
    });
  }

  protected initMiddleware(): void {
    this.initParserMiddleware();
    this.initSecurityMiddleware();
    this.initDebugMiddleware();
    this.initHealthMiddleware();
  }

  protected initParserMiddleware(): void {
    new AppParsers(this.app);
  }

  protected initHealthMiddleware(): void {
    new AppHealth(this.app);
  }

  protected initDebugMiddleware(): void {
    new AppDebug(this.app);
  }

  protected initSecurityMiddleware(): void {
    new AppSecurity(this.app);
  }

  // public abstract initRouting(): void;
}

class TestApp extends BaseApp {

}

const server = new TestApp().serve();
