import { Module } from '@nestjs/common';

import { NominationsController } from './nominations.controller';
import { NominationsService } from './nominations.service';

@Module({
  imports: [],
  controllers: [NominationsController],
  providers: [NominationsService],
})
export class NominationsModule {}
