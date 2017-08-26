import { bodyParser } from '../../../lib/body-parser';
import { cookieParser } from '../../../lib/cookie-parser';
import { BaseMiddleware } from '../base/middleware';
import { AppConfig } from '../../services/app-config';

export class AppParsers extends BaseMiddleware {
  public init() {
    if (!!AppConfig.get('parsers:body')) {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({extended: false}));
    }

    if (!!AppConfig.get('parsers:cookie')) {
      this.app.use(cookieParser());
    }
  }
}