import { writeFile } from 'fs';

// PATTERN:Observer
interface LoggerSubscriber {
  update(data: string, isError: boolean): void;
}

export class FileLogger implements LoggerSubscriber {
  private readonly filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  public update(log: string): void {
    writeFile(this.filename, log + '\n', { flag: 'a' }, err => {
      if (err) {
        throw err;
      }
    });
  }
}

export class ErrorConsoleLogger implements LoggerSubscriber {
  public update(log: string, isError: boolean): void {
    if (isError) {
      console.log(log);
    }
  }
}

export class Logger {
  private subscribers: LoggerSubscriber[] = [];

  public addSubscriber(subscriber: LoggerSubscriber): void {
    this.subscribers.push(subscriber);
  }

  public log(data: string, isError: boolean = false): void {
    this.subscribers.forEach(subscriber => subscriber.update(data, isError));
  }
}
