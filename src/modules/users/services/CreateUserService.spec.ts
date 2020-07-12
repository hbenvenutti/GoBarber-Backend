import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fake/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '12345',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('johndoe@email.com');
    expect(user.avatar).toBe(undefined);
  });

  it('should not be able to create user with existing e-mail', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '12345',
    });

    await expect(
      createUser.execute({
        email: 'johndoe@email.com',
        name: 'John Doe',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
