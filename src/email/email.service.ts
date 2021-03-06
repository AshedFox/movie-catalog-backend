import { Injectable } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { MailingService } from './mailing.service';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConfirmationModel } from './entities/email-confirmation.model';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailConfirmationModel)
    private readonly emailConfirmationRepository: Repository<EmailConfirmationModel>,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly mailingService: MailingService,
    private readonly userService: UserService,
  ) {}

  async sendConfirmation(id: string, email: string): Promise<boolean> {
    const confirmation = await this.emailConfirmationService.create(id, email);
    await this.mailingService.sendConfirmation(confirmation);
    return true;
  }

  async confirmEmail(id: string, email: string): Promise<boolean> {
    const confirmation =
      await this.emailConfirmationService.readOneNotExpiredByIdAndEmail(
        id,
        email,
      );

    if (!confirmation) {
      throw new NotFoundError();
    }

    await this.userService.setEmailConfirmed(confirmation.userId);
    return true;
  }
}
