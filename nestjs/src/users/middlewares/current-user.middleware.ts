import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

export type AppRequest = Request & {
  currentUser?: Partial<User>;
};

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(request: AppRequest, res: Response, next: NextFunction) {
    const { email } = request.session || {};
    if (email) {
      const [user] = await this.usersService.find(email);
      request.currentUser = user;
    }
    next();
  }
}
