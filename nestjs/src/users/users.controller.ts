import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update.user.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.entity';
import { instanceToPlain } from 'class-transformer';
import { Notoken } from '../common/decorators/no-jwt.decorator';

export type AppSession = {
  userId?: number;
  color?: string;
};

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Get all users
  @Notoken()
  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  // Get the currently signed user
  @Notoken()
  @Serialize(UserDto)
  @Get('/currentuser')
  getCurrentUser(@CurrentUser() user: User, @Session() session: AppSession) {
    const resp = { user: user, session: instanceToPlain(session) };
    return JSON.stringify(resp);
  }

  // Get encrypted information from cookie
  @Serialize(UserDto)
  @Get('/color')
  getColor(@Session() session: AppSession) {
    const obj = { userId: instanceToPlain(session.userId), color: instanceToPlain(session.color) };
    const color = instanceToPlain(obj.color);
    return JSON.stringify(obj);
  }

  // Get user with id
  @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOneId(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  // Delete user with id
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.removeUser(parseInt(id));
  }

  // Update user with id
  @Patch('/:id')
  @Serialize(UserDto)
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.updateUser(parseInt(id), body);
  }

  // Store encrypted information in cookies
  @Serialize(UserDto)
  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: AppSession) {
    session.color = color;
  }
}
