import { AppConfig } from '../common/services/app-config';
import { AppLog } from '../common/services/app-log';
import { AppColor } from '../util/terminal-color';
import * as process from 'process';

enum exitCode {
  SUCCESS = 0,
  FAILURE = 1
};

export class AppGracefulProcess {
  public static init() {
    if (!this.initCount) {
      this.initCount++;
      this.initHandler();
    } else {
      AppLog.warn('APP-PROC-01', 'AppGracefulProcess allowed only once');
    }
  }

  private static initCount = 0;

  private static initHandler() {
    function gracefulExit (code: exitCode) {
      AppColor.setAppTitle(AppConfig.get('package:name'));
      AppColor.setAppMessage(' shutdown');
      process.exit(code)
    }

    process
      .on('uncaughtException', function(err: Error) {
        AppLog.fatal('APP-FATAL-00', err);
        gracefulExit(exitCode.FAILURE);
      })
  }
}
