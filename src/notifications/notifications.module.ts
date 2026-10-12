import { Module } from '@nestjs/common';
import { UserCreatedListener } from './listeners/user-created.listener';

@Module({
  providers: [UserCreatedListener],
})
export class NotificationsModule {}
