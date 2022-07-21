import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { ExampleModule } from './example/example.module';

// Auto validate and transform all requests
const validationPipe = new ValidationPipe({ transform: true });

@Module({
  imports: [CoreModule, ExampleModule],
  providers: [
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class AppModule {}
