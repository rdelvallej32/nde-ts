import * as http from 'http';
import * as path from 'path';

import { express } from './lib/express';

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
  }

  // public abstract initRouting(): void;

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
}

class TestApp extends BaseApp {

}

const server = new TestApp().serve();