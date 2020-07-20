import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IPasswordRecoveryTokenRepository from '../repositories/IPasswordRecoveryTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PasswordTokenRepository')
    private passwordTokensRepository: IPasswordRecoveryTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: IRequestDTO): Promise<void> {
    const passwordToken = await this.passwordTokensRepository.findByToken(
      token,
    );

    if (!passwordToken) {
      throw new AppError('Password token does not exist');
    }

    const user = await this.usersRepository.findById(passwordToken.user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    const tokenCreatedAt = passwordToken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
