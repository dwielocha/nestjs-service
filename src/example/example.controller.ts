import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateExampleDTO } from './dto/create-example.dto';
import { ExampleService } from './example.service';

@Controller()
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  getHello(): string {
    return this.exampleService.getHello();
  }

  @Get('/test')
  async runTest(): Promise<string> {
    return Promise.all(['Hello from test!']).then((result) => result[0]);
  }

  @Post('/example/create')
  async create(@Body() createExampleDTO: CreateExampleDTO) {
    return JSON.stringify({
      result: 'New example has been created.',
      type: typeof createExampleDTO.createdAt,
    });
  }
}
