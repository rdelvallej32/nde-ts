import { helmet } from '../../../lib/helmet';
import { csurf } from '../../../lib/csurf';

import { AppConfig } from '../../services/app-config';
import { BaseMiddleware } from '../base/middleware';

import { express } from '../../../lib/express';

const app = express();

export class AppSecurity extends BaseMiddleware {
  public init() {
    this.setSecurityOptions();
  }

  protected setSecurityOptions(): void {
    this.useHelmet();
    this.useCsurf();
  }

  private useHelmet(): void {
    const conf: Object = AppConfig.get('security:helmet');
    if (conf) {
      this.app.use(helmet(conf));
    }
  }

  private useCsurf(): void {
    const conf: Object = AppConfig.get('security:csrf');
    if (conf) {
      const csrfProtection = csurf(conf);
      this.app.set('csrfProtection', csrfProtection);
    }
  }
}
