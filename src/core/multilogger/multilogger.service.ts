import { ConsoleLogger, LoggerService, LogLevel } from '@nestjs/common';

export class MultiLoggerService implements LoggerService {
  private transports: LoggerService[] = [];

  /**
   * Add logger service
   * @param loggerService LoggerService
   */
  add(loggerService: LoggerService) {
    this.transports.push(loggerService);
  }

  log(message: any, ...optionalParams: any[]) {
    this.processMessage('log', message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.processMessage('error', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.processMessage('warn', message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.processMessage('debug', message, optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.processMessage('verbose', message, optionalParams);
  }

  setLogLevels?(levels: LogLevel[]) {
    for (const transport of this.transports) {
      transport.setLogLevels(levels);
    }
  }

  private processMessage(
    fnToCall: string,
    message: any,
    ...optionalParams: any[]
  ) {
    for (const transport of this.transports) {
      transport[fnToCall](message, ...optionalParams);
    }
  }
}
