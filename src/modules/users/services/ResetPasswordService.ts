import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IPasswordRecoveryTokenRepository from '../repositories/IPasswordRecoveryTokensRepository';

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

    user.password = password;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
