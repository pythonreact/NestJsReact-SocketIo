import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async getAllUsers() {
    const users = this.usersRepository.find();
    return users;
  }

  async createUser(email: string, password: string) {
    const user = this.usersRepository.create({ email, password });
    await this.usersRepository.save(user);
    return user;
  }

  findOneId(id: number) {
    if (!id) {
      return null;
    }
    return this.usersRepository.findOneBy({ id });
  }

  findOneEmail(email: string) {
    if (!email) {
      return null;
    }
    return this.usersRepository.findOneBy({ email });
  }

  find(email: string) {
    return this.usersRepository.find({ where: { email } });
  }

  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.findOneId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async removeUser(id: number) {
    const user = await this.findOneId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.remove(user);
  }
}
