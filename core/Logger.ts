export enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

export interface ILogger {
  error(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  debug(message: string, ...args: any[]): void

  getLogs(): string[];
}

export class Logger implements ILogger {
    private level: LogLevel = LogLevel.INFO; // 默认日志级别
    private logs: string[] = []; // 日志信息
  
    constructor(level?: LogLevel) {
      if (level !== undefined) {
        this.level = level;
      }
    }
  
    public setLevel(level: LogLevel): void {
      this.level = level;
    }
  
    public error(message: string, ...args: any[]): void {
      if (this.level <= LogLevel.ERROR) {
        const logMessage = `[ERROR] ${message}`;
        console.error(logMessage, ...args);
        this.logs.push(logMessage);
      }
    }
  
    public warn(message: string, ...args: any[]): void {
      if (this.level <= LogLevel.WARN) {
        const logMessage = `[WARN] ${message}`;
        console.warn(logMessage, ...args);
        this.logs.push(logMessage);
      }
    }
  
    public info(message: string, ...args: any[]): void {
      if (this.level <= LogLevel.INFO) {
        const logMessage = `[INFO] ${message}`;
        console.info(logMessage, ...args);
        this.logs.push(logMessage);
      }
    }
  
    public debug(message: string, ...args: any[]): void {
      if (this.level <= LogLevel.DEBUG) {
        const logMessage = `[DEBUG] ${message}`;
        console.debug(logMessage, ...args);
        this.logs.push(logMessage);
      }
    }
  
    public getLogs(): string[] {
      return this.logs;
    }

    public search(query: string): string[] {
        return this.logs.filter(log => log.includes(query));
      }
}

export const logger = new Logger()
