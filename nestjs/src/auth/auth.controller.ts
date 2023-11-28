import { Notoken } from './../common/decorators/no-jwt.decorator';
import { Body, Controller, HttpCode, Post, UseGuards, Request, Session } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // User sign up
  @ApiOperation({ summary: 'User Sign Up', description: 'User Sign Up' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for sign up',
  })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created, response => token',
  })
  @Notoken()
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<{ token: string }> {
    const user = await this.authService.signUp(body.email, body.password);
    return user;
  }

  // User sign in
  @ApiOperation({ summary: 'User Sign In', description: 'User Sign In' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for sign in',
  })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in, response => token',
  })
  @Notoken()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(200)
  async userSignIn(@Body() body: CreateUserDto): Promise<{ token: string }> {
    const user = await this.authService.signIn(body);
    return user;
  }

  // User sign out
  @ApiOperation({ summary: 'User Sign Out', description: 'User Sign Out' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed out',
  })
  @Notoken()
  @Post('/signout')
  @HttpCode(200)
  async userSingOut(@Request() req) {
    return { msg: `User signed out` };
  }
}
