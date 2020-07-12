// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fake/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import SendForgotenPasswordEmailService from './SendForgotenPasswordEmailService';
import FakePasswordRecoveryTokensRepository from '../repositories/fake/FakePasswordRecoveryTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotenPasswordEmail: SendForgotenPasswordEmailService;
let fakePasswordTokenRepository: FakePasswordRecoveryTokensRepository;

describe('SendForgotenPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakePasswordTokenRepository = new FakePasswordRecoveryTokensRepository();

    sendForgotenPasswordEmail = new SendForgotenPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakePasswordTokenRepository,
    );
  });

  it('should be able to recover the password with email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
    });

    await sendForgotenPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover password without a valid email', async () => {
    await expect(
      sendForgotenPasswordEmail.execute({
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate forgoten password token', async () => {
    const generateToken = jest.spyOn(fakePasswordTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
    });

    await sendForgotenPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
