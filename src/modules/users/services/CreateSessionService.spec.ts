import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fake/FakeHashProvider';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create session', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeRepository, fakeHashProvider);
    const createSession = new CreateSessionService(
      fakeRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345',
    });

    const response = await createSession.execute({
      email: 'johndoe@email.com',
      password: '12345',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to create session without valid user', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createSession = new CreateSessionService(
      fakeRepository,
      fakeHashProvider,
    );

    expect(
      createSession.execute({
        email: 'johndoe@email.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create session with wrong password', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeRepository, fakeHashProvider);
    const createSession = new CreateSessionService(
      fakeRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345',
    });

    expect(
      createSession.execute({
        email: 'johndoe@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
