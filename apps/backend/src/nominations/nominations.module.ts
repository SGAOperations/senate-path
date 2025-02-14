import { Module } from '@nestjs/common';

import { NominationsController } from './nominations.controller';
import { NominationsService } from './nominations.service';
import { EmailsModule } from '../emails/emails.module'; // Import EmailsModule

@Module({
  imports: [EmailsModule], 
  controllers: [NominationsController],
  providers: [NominationsService],
})
export class NominationsModule {}
