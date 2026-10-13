import { WorkerHost, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_QUEUE, WELCOME_JOB, WelcomeEmailPayload } from './mail.constants';
import { MailService } from './mail.service';

@Processor(MAIL_QUEUE, { concurrency: 5 })
export class MailProcessor extends WorkerHost {
  constructor(private readonly mail: MailService) {
    super();
  }

  async process(job: Job<WelcomeEmailPayload>): Promise<void> {
    switch (job.name) {
      case WELCOME_JOB:
        await this.mail.sendWelcome(job.data);
        return;
      default:
        // Unknown job names are a deployment bug, not a transient failure: fail loudly.
        throw new Error(`Unsupported mail job: ${job.name}`);
    }
  }
}
