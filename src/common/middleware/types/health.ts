import { AppConfig } from '../../services/app-config';
import { BaseMiddleware } from '../base/middleware';

export class AppHealth extends BaseMiddleware {
  public init() {
    let health = AppConfig.get('health');
    if (health && health.route) {
      this.app.all(health.route, (req, res) => {
        res.sendStatus(200);
      });
    }
  }
}