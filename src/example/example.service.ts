import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);

  getHello(): string {
    this.logger.log('Hey, you should see me in logs!');
    return 'Hello World!';
  }
}
