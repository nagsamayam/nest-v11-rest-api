import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user-dto/create-user.dto';
import { toUserResponse, UserResponse } from './user.resource';
import { PasswordService } from '../auth/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

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
      return toUserResponse(savedUser);
    } catch (error) {
      throw error;
    }
  }
}
