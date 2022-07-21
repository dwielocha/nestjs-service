import { LoggerService, LogLevel } from '@nestjs/common';
import { Log, Logging } from '@google-cloud/logging';
import { Entry, LogEntry } from '@google-cloud/logging/build/src/entry';
import { randomUUID } from 'crypto';

enum Severity {
  INFO = 'INFO',
  WARN = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  CRITICAL = 'CRITICAL',
  ALERT = 'ALERT',
  NOTICE = 'NOTICE',
  EMERGENCY = 'EMERGENCY',
}

export type GoogleCloudLoggerConfig = {
  projectId: string;
  applicationId: string;
  deploymentId: string;
  environment: string;
  serviceName: string;
  version: string;
};

export class GoogleCloudLogger implements LoggerService {
  /**
   * Statically track the all logs in a given execution of the
   * entire codebase.
   */
  static readonly applicationSpan = randomUUID();

  private readonly config: GoogleCloudLoggerConfig;

  private readonly logger: Log;

  constructor(config: GoogleCloudLoggerConfig) {
    this.config = config;
    this.logger = new Logging({ projectId: config.projectId }).log(
      'applications',
    );
  }

  async log(message: any, ...optionalParams: any[]) {
    this.logger.info(this.createEntry(Severity.INFO, message, optionalParams));
  }

  async error(message: any, ...optionalParams: any[]) {
    this.logger.warning(
      this.createEntry(Severity.ERROR, message, optionalParams),
    );
  }

  async warn(message: any, ...optionalParams: any[]) {
    this.logger.warning(
      this.createEntry(Severity.WARN, message, optionalParams),
    );
  }

  async debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(
      this.createEntry(Severity.DEBUG, message, optionalParams),
    );
  }

  async verbose?(message: any, ...optionalParams: any[]) {
    this.logger.info(
      this.createEntry(Severity.NOTICE, message, optionalParams),
    );
  }

  setLogLevels?(levels: LogLevel[]) {
    // do nothing
  }

  private createEntry(severity: Severity, message: any, extra: any): Entry {
    const meta: LogEntry = {
      jsonPayload: {
        fields: {
          applicationSpan: GoogleCloudLogger.applicationSpan as any,
          extra: extra,
        },
      },
      textPayload: message,
      severity: severity,
      resource: {
        labels: {
          projectId: this.config.projectId,
          projectName: this.config.projectId,
          applicationId: this.config.applicationId,
          deploymentId: this.config.deploymentId,
          environment: this.config.environment,
          service: this.config.serviceName,
          version: this.config.version,
        },
      },
    };

    return this.logger.entry(meta);
  }
}
