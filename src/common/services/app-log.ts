import * as fs from 'fs';
import * as path from 'path';
import { bunyan } from '../../lib/bunyan';
import { express } from '../../lib/express';
import { lodash as _ } from '../../lib/lodash';
import { AppConfig } from '../services/app-config';

export enum LogLevel {
  TRACE = bunyan.TRACE,
  DEBUG = bunyan.DEBUG,
  INFO = bunyan.INFO,
  WARN = bunyan.WARN,
  ERROR = bunyan.ERROR,
  FATAL = bunyan.FATAL,
}

type LogDetail = {
  code?: string;
  msg?: string;
  err?: Error;
  req?: express.Request;
  [custom: string]: any;
};

class NodeAppLog {
  private _log: bunyan;
  private _levels: LogLevel[] = [LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
  private streams: bunyan.Stream[] = [];
  constructor(volume: string) {
    this.initStreams(volume);
    this._log = bunyan.createLogger({
      src: false,
      name: AppConfig.get('package:name'),
      version: AppConfig.get('package:version'),
      streams: this.streams,
      serializers: {
        err: this.errSerializer,
        req: this.reqSerializer,
      }
    });
  }

  private initStreams(volume: string): void {
    try {
      fs.accessSync(volume, fs.constants.W_OK);
      this.createStreams(volume);
    } catch(e) {
      this.streams = [
        { level: LogLevel.DEBUG, stream: process.stdout },
        { level: LogLevel.WARN, stream: process.stdout },
        { level: LogLevel.ERROR, stream: process.stderr },
      ];
    }
  }

  private createStreams(volume: string): void {
    this._levels.forEach((level) => {
        let filename = AppConfig.get(`logs:${this.levelName(level)}`);
        if (filename) {
          this.streams.push({
            level: level,
            path: path.join(volume, filename)
          });
        }
      });
  }

  private reqSerializer(req: express.Request): any {
    return {
      method: req.method,
      url: req.url,
      params: req.params,
      headers: req.headers
    };
  }

  private errSerializer(err: Error): any {
    return bunyan.stdSerializers.err(err);
  }

  private levelName(level: LogLevel): string {
    return _.lowerCase(LogLevel[level]);
  }

  public log(level: LogLevel, code: string, msg: string | Error, detail: LogDetail = {}): void {
    detail.code = code;
    if (msg instanceof Error) {
      msg = <Error>msg;
      detail.err = msg;
    } else {
      detail.msg = <string>msg;
    }

    let method = this.levelName(level);
    this._log[method](detail, detail.msg);
  }
}

const appLog = new NodeAppLog(AppConfig.get('env:VOLUME_LOG'));

export const AppLog = {
  log: (level: LogLevel, code: string, msg: string| Error, detail?: LogDetail): void => {
    return appLog.log(level, code, msg, detail);
  },
  trace: (code: string, msg: string, detail?: LogDetail): void => {
    return appLog.log(LogLevel.TRACE, code, msg, detail);
  },
  debug: (code: string, msg: string, detail?: LogDetail): void => {
    return appLog.log(LogLevel.DEBUG, code, msg, detail);
  },
  info: (code: string, msg: string, detail?: LogDetail): void => {
    return appLog.log(LogLevel.INFO, code, msg, detail);
  },
  warn: (code: string, msg: string | Error, detail?: LogDetail): void => {
    return appLog.log(LogLevel.WARN, code, msg, detail);
  },
  error: (code: string, error: Error, detail?: LogDetail): void => {
    return appLog.log(LogLevel.ERROR, code, error, detail);
  },
  fatal: (code: string, error: Error, detail?: LogDetail): void => {
    return appLog.log(LogLevel.FATAL, code, error, detail);
  }
};