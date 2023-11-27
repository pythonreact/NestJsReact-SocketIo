import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const signup = async (userEmail: string, userPassword: string) => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: userPassword })
      .expect(201);
    const { id, email } = res.body;
    const cookie = res.get('Set-Cookie');
    return { id, email, cookie };
  };

  const signin = async (userEmail: string, userPassword: string) => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: userEmail, password: userPassword })
      .expect(200);
    const body = res.body;
    return body;
  };

  it('signUp request', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'password';
    const { id, email } = await signup(userEmail, userPassword);
    expect(id).toBeDefined();
    expect(email).toEqual(userEmail);
  });

  it('signin request', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'password';
    const { id } = await signup(userEmail, userPassword);

    const body = await signin(userEmail, userPassword);
    expect(body.email).toEqual(userEmail);
    expect(body.id).toEqual(id);
  });

  it('signout request', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'password';
    await signup(userEmail, userPassword);

    await signin(userEmail, userPassword);

    await request(app.getHttpServer()).post('/auth/signout').expect(200);
  });

  it('currentuser request signup as a new user and then get currently logged in user', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'password';
    const { cookie } = await signup(userEmail, userPassword);

    const { body } = await request(app.getHttpServer())
      .get('/auth/currentuser')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(userEmail);
  });

  it('get user with id', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'password';
    const { id } = await signup(userEmail, userPassword);

    const { body } = await request(app.getHttpServer()).get(`/auth/${id}`).expect(200);
    expect(body.id).toEqual(id);
    expect(body.email).toEqual(userEmail);
  });

  it('get users with email', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'password';
    const { id } = await signup(userEmail, userPassword);

    const { body } = await request(app.getHttpServer()).get(`/auth/?${userEmail}`).expect(200);
    expect(body[0].id).toEqual(id);
    expect(body[0].email).toEqual(userEmail);
  });

  it('delete user with id', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'password';
    const { id } = await signup(userEmail, userPassword);
    const { body } = await request(app.getHttpServer()).delete(`/auth/${id}`).expect(200);

    expect(body.email).toEqual(userEmail);
  });

  it('update user with id', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'password';
    const newUserEmail = 'user1@email.com';
    const newUserPassword = 'newPassword';
    const { id } = await signup(userEmail, userPassword);

    const { body } = await request(app.getHttpServer())
      .patch(`/auth/${id}`)
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(200);

    expect(body.id).toEqual(id);
    expect(body.email).toEqual(newUserEmail);
    expect(body.password).toEqual(newUserPassword);
  });
});
