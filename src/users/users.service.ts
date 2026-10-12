import {
  ConflictException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user-dto/create-user.dto';
import { toUserResponse, UserResponse } from './user.resource';
import { PasswordService } from '../auth/password.service';
import { USER_EVENTS, UserCreatedEvent } from './events/user-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onApplicationBootstrap() {
    console.log('Registered Listeners:', this.eventEmitter.eventNames());
  }

  async create(userDto: CreateUserDto): Promise<UserResponse> {
    const { firstName, lastName, email, password } = userDto;
    const passwordHash = await this.passwordService.hash(password);

    const emailExists = await this.userRepository.existsBy({ email: email });
    if (emailExists) {
      throw new ConflictException({
        message: 'An account with this email already exists',
      });
    }

    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      this.emitUserCreatedEvent(savedUser);
      return toUserResponse(savedUser);
    } catch (error) {
      throw error;
    }
  }

  private emitUserCreatedEvent(user: User): void {
    const userCreatedEvent = new UserCreatedEvent(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
    );

    this.eventEmitter.emit(USER_EVENTS.CREATED, userCreatedEvent);
  }
}
