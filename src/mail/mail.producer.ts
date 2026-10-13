import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { MAIL_QUEUE, WELCOME_JOB, WelcomeEmailPayload } from './mail.constants';
import { Queue } from 'bullmq';

@Injectable()
export class MailProducer {
  constructor(
    @InjectQueue(MAIL_QUEUE) private readonly queue: Queue<WelcomeEmailPayload>,
  ) {}

  async enqueueWelcome(payload: WelcomeEmailPayload): Promise<void> {
    // A deterministic job id makes the enqueue idempotent: the same user can never be sent two
    // welcome emails, even if registration is retried. (BullMQ ids must not contain ":".)
    await this.queue.add(WELCOME_JOB, payload, {
      jobId: `welcome-${payload.userId}`,
    });
  }
}
