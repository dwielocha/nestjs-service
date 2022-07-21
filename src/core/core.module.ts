import { Module } from '@nestjs/common';
import { MultiLoggerService } from './multilogger/multilogger.service';

@Module({
  providers: [MultiLoggerService],
  exports: [MultiLoggerService],
})
export class CoreModule {}
