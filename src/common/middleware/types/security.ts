import { helmet } from '../../../lib/helmet';

import { AppConfig } from '../../services/app-config';
import { BaseMiddleware } from '../base/middleware';

import { express } from '../../../lib/express';

const app = express();

export class AppSecurity extends BaseMiddleware {
  public init() {
    const conf: Object = AppConfig.get('security:helmet');
    if (!!conf) {
      this.app.use(helmet(conf));
    }
  }
}
