import { morgan } from '../../../lib/morgan';
import { AppConfig } from '../../services/app-config';
import { BaseMiddleware } from '../base/middleware';

export class AppDebug extends BaseMiddleware {
  public init() {
    if (!AppConfig.isProd() && AppConfig.getEnvironment() !== 'test') {
      this.app.use(morgan('dev'));
    }
  }
}
