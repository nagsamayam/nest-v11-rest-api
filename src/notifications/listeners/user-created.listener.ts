import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  USER_EVENTS,
  UserCreatedEvent,
} from 'src/users/events/user-created.event';

@Injectable()
export class UserCreatedListener {
  private readonly logger = new Logger(UserCreatedListener.name);

  @OnEvent(USER_EVENTS.CREATED, { async: true })
  async handle(event: UserCreatedEvent) {
    this.logger.log(
      `Processing asynchronous notification processing for: ${event.email}`,
    );
    try {
      await this.sendWelcomeEmail(event.email, event.firstName);
    } catch (error) {
      this.logger.error(
        `Failed to execute notification routine for user ID ${event.userId}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  private async sendWelcomeEmail(email: string, name: string) {
    //
  }
}
