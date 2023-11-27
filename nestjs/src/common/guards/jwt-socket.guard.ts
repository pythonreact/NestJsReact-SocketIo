import { CanActivate, Injectable } from '@nestjs/common';
import { jwtConstants } from '../../auth/constants';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtSocketGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: any): Promise<any> {
    const request = context.switchToWs().getData();
    const data = request.data;
    const token = request.token.token;
    if (!token) {
      throw new WsException('Token is not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const email = payload.email;
      request.email = email;

      return new Promise((resolve, reject) => {
        return this.usersRepository.find({ where: { email } }).then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      console.log('error', ex);
      return false;
    }
  }
}
