import { Body, Controller, HttpCode, Post, UseGuards, Request, Session } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { Notoken } from '../common/decorators/no-jwt.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // User sign up
  @Notoken()
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<{ token: string }> {
    const user = await this.authService.signUp(body.email, body.password);
    return user;
  }

  // User sign in
  @Notoken()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @HttpCode(200)
  async userSignIn(@Request() req): Promise<{ token: string }> {
    const user = await this.authService.signIn(req.body);
    return user;
  }

  // User sign out
  @Post('/signout')
  @HttpCode(200)
  async userSingOut(@Request() req) {
    return { msg: `User signed out` };
  }
}
