import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string): Promise<{ token: string }> {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const resultPassword = salt + '.' + hash.toString('hex');

    const user = await this.usersService.createUser(email, resultPassword);

    const token = this.jwtService.sign({ email: user.email });
    return { token };
  }

  async validateUser(email: string, password: string): Promise<Partial<User>> | undefined {
    const user = await this.usersService.findOneEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    const bufferFromPassword = (await scrypt(password, salt, 64)) as Buffer;
    if (!timingSafeEqual(storedBuffer, bufferFromPassword)) {
      return undefined;
    } else {
      return { ...user, password: undefined };
    }
  }

  async signIn(user: CreateUserDto): Promise<{ token: string }> {
    const userValid = await this.validateUser(user.email, user.password);
    if (!userValid) {
      return undefined;
    }
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
