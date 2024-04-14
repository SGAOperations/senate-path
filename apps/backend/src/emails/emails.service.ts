import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailRequestDto } from './dto/create-email-request.dto';

@Injectable()
export class EmailsService {
  constructor(private mailerService: MailerService) {}

  async createEmail(request: CreateEmailRequestDto): Promise<void> {
    await this.mailerService.sendMail({
      to: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM,
      bcc: request.recipients,
      subject: request.subject,
      template: './email-template',
      context: {
        message: request.message,
      },
    });
  }
}
