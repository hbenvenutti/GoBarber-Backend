import FakeUsersRepository from '../repositories/fake/FakeUsersRepository';
import FakePasswordRecoveryTokensRepository from '../repositories/fake/FakePasswordRecoveryTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakePasswordRecoveryTokensRepository: FakePasswordRecoveryTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePasswordRecoveryTokensRepository = new FakePasswordRecoveryTokensRepository();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakePasswordRecoveryTokensRepository,
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

    await resetPassword.execute({
      password: 'new-password',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('new-password');
  });
});
