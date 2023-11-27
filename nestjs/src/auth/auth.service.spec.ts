import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, storedHash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(storedHash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'asdf@asdf.com', password: 'asdf' } as User]);
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException);
  });

  it('throws an error if a signin is called with an unused email', async () => {
    await expect(service.signIn('asdf@notusedemail.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if invalid password is provided', async () => {
    await service.signUp('asdf@asdf.com', 'password');
    await expect(service.signIn('asdf@asdf.com', 'invalidpassword')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp('asdf@asdf.com', 'password');
    const user = await service.signIn('asdf@asdf.com', 'password');
    expect(user).toBeDefined();
  });
});
