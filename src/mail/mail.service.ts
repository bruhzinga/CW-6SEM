import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async SendNewPasswordEmail(email: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'zvor2003@gmail.com',
      subject: 'New Password',
      text: `Your new password is ${password}`,
    });
  }
}
