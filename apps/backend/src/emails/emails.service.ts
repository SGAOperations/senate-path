import { Injectable } from '@nestjs/common';
import { CreateEmailRequestDto } from './dto/create-email-request.dto';

@Injectable()
export class EmailsService {
  async createEmail(request: CreateEmailRequestDto): Promise<Response> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: process.env.RESEND_TO_EMAIL,
        bcc: request.recipients,
        subject: request.subject,
        text: request.message,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
