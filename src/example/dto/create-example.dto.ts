import { Type } from 'class-transformer';

export class CreateExampleDTO {
  title: string;
  description: string;
  @Type(() => Date)
  createdAt: Date;
}
