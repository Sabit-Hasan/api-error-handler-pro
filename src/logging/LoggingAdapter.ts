import { BaseError } from "../core/BaseError";

export interface LoggerInterface {
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
  debug(message: string, data?: any): void;
}

/**
 * Winston Adapter
 */
export class WinstonAdapter implements LoggerInterface {
  private logger: any;

  constructor(logger: any) {
    this.logger = logger;
  }

  info(message: string, data?: any): void {
    this.logger.info(message, data);
  }

  warn(message: string, data?: any): void {
    this.logger.warn(message, data);
  }

  error(message: string, data?: any): void {
    this.logger.error(message, data);
  }

  debug(message: string, data?: any): void {
    this.logger.debug(message, data);
  }
}

/**
 * Pino Adapter
 */
export class PinoAdapter implements LoggerInterface {
  private logger: any;

  constructor(logger: any) {
    this.logger = logger;
  }

  info(message: string, data?: any): void {
    this.logger.info(data, message);
  }

  warn(message: string, data?: any): void {
    this.logger.warn(data, message);
  }

  error(message: string, data?: any): void {
    this.logger.error(data, message);
  }

  debug(message: string, data?: any): void {
    this.logger.debug(data, message);
  }
}

/**
 * Console Adapter (Default)
 */
export class ConsoleAdapter implements LoggerInterface {
  info(message: string, data?: any): void {
    console.log(`[INFO] ${message}`, data || "");
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data || "");
  }

  error(message: string, data?: any): void {
    console.error(`[ERROR] ${message}`, data || "");
  }

  debug(message: string, data?: any): void {
    console.debug(`[DEBUG] ${message}`, data || "");
  }
}

/**
 * Logging Service
 */
export class LoggingService {
  private logger: LoggerInterface;

  constructor(logger: LoggerInterface = new ConsoleAdapter()) {
    this.logger = logger;
  }

  setLogger(logger: LoggerInterface): void {
    this.logger = logger;
  }

  logError(error: Error | BaseError): void {
    const data = {
      message: error.message,
      stack: error.stack,
      ...(error instanceof BaseError && {
        statusCode: error.statusCode,
        details: error.details,
      }),
    };

    this.logger.error("An error occurred", data);
  }

  logValidationError(errors: Record<string, string>): void {
    this.logger.warn("Validation error", { errors });
  }

  logDatabaseError(error: any): void {
    this.logger.error("Database error", {
      name: error.name,
      code: error.code,
      message: error.message,
    });
  }

  info(message: string, data?: any): void {
    this.logger.info(message, data);
  }

  warn(message: string, data?: any): void {
    this.logger.warn(message, data);
  }

  debug(message: string, data?: any): void {
    this.logger.debug(message, data);
  }
}

export const loggingService = new LoggingService();
