import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ApplicationsModule } from '../applications/applications.module';
import { NominationsModule } from '../nominations/nominations.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UsersModule, ApplicationsModule, NominationsModule, EmailsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
