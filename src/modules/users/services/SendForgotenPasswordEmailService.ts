import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
// import User from '@modules/users/infra/typeorm/entities/User';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IPasswordRecoveryTokenRepository from '../repositories/IPasswordRecoveryTokensRepository';
import PasswordRecoveryToken from '../infra/typeorm/entities/PasswordRecoveryToken';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotenPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('PasswordTokenRepository')
    private passwordTokenRepository: IPasswordRecoveryTokenRepository,
  ) {}

  public async execute({ email }: IRequestDTO): Promise<PasswordRecoveryToken> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email');
    }

    const token = await this.passwordTokenRepository.generate(user.id);

    this.mailProvider.sendMail(email, 'Password recovery request received');

    return token;
  }
}

export default SendForgotenPasswordEmailService;
