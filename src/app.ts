/* tslint:disable:no-unused-expression */
import * as http from 'http';
import * as path from 'path';

import { express } from './lib/express';
import { lodash as _ } from './lib/lodash';

import {
  AppDebug,
  AppHealth,
  AppParsers,
  AppSecurity
} from './common/middleware';

import { AppConfig, AppLog, NodeAppConfig } from './common/services/index';

export interface NodeAppInterface {
  initRouting(): void;
  serve(): http.Server;
}

export type BaseProcess = 'middleware' | 'view-engine' | 'routing';

export abstract class BaseApp implements NodeAppInterface {
  protected app: express.Express;
  protected config: NodeAppConfig = AppConfig;

  constructor() {
    this.app = express();
    this.initBase('middleware')
      .initBase('routing');
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

  public abstract initRouting(): void;

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

  private initBase(process: BaseProcess, ...args: any[]): BaseApp {
    let methodName = `init${_.upperFirst(_.camelCase(process))}`;
    const method: Function = this[methodName];
    const preMethod: Function = this[`before${_.upperFirst(_.camelCase(methodName))}`];
    const postMethod: Function = this[`after${_.upperFirst(_.camelCase(methodName))}`];
    // call "preInit"
    if (preMethod) {
      preMethod.apply(this, args);
    }
    // call "init*"
    if (method) {
      method.apply(this, args);
    } else {
      AppLog.error(`BASE-001`, new Error(`Attempt to call missing magic method "${methodName}"`));
    }
    // call "postInit*"
    if (postMethod) {
      postMethod.apply(this, args);
    }
    return this;
  }
}

class TestApp extends BaseApp {
  initRouting() {

  }
}

const server = new TestApp().serve();
