import { Module } from '@nestjs/common';
import { FormworkService } from './formwork.service';
import { FormworkController } from './formwork.controller';

@Module({
  controllers: [FormworkController],
  providers: [FormworkService],
})
export class FormworkModule {}
