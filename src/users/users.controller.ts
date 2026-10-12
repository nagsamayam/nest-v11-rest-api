import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  createUserSchema,
  type CreateUserDto,
} from './dto/create-user-dto/create-user.dto';
import { UserResponse } from './user.resource';
import { ZodValidationPipe } from '../common/pipes/zod-validation-pipe/zod-validation-pipe.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.userService.create(createUserDto);
  }
}
