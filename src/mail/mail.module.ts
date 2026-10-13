import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MAIL_QUEUE } from './mail.constants';
import { MailProcessor } from './mail.processor';
import { getEnv } from 'src/config/env';
import { MailService } from './mail.service';
import { MailProducer } from './mail.producer';

// Instances started with QUEUE_WORKER_ENABLED=false only enqueue; they never consume jobs.
const workerProviders = getEnv().QUEUE_WORKER_ENABLED ? [MailProcessor] : [];

@Module({
  imports: [
    BullModule.registerQueue({
      name: MAIL_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: { age: 3_600, count: 1_000 },
        removeOnFail: { age: 7 * 24 * 3_600 },
      },
    }),
  ],
  providers: [MailService, MailProducer, ...workerProviders],
  exports: [MailProducer],
})
export class MailModule {}
