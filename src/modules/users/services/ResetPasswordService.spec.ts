import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import FakePasswordRecoveryTokensRepository from '../repositories/fake/FakePasswordRecoveryTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fake/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakePasswordRecoveryTokensRepository: FakePasswordRecoveryTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePasswordRecoveryTokensRepository = new FakePasswordRecoveryTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakePasswordRecoveryTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
    });

    const { token } = await fakePasswordRecoveryTokensRepository.generate(
      user.id,
    );

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: 'new-password',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('new-password');
    expect(updatedUser?.password).toBe('new-password');
  });

  it('should not be able to reset the password without token', async () => {
    await expect(
      resetPassword.execute({
        token: 'invalid',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password without a valid user', async () => {
    const { token } = await fakePasswordRecoveryTokensRepository.generate(
      'invalid-user-id',
    );

    await expect(
      resetPassword.execute({
        token,
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with expired token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
    });

    const { token } = await fakePasswordRecoveryTokensRepository.generate(
      user.id,
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: 'new-password',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
