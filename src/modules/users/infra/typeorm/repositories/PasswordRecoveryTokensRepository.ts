import { getRepository, Repository } from 'typeorm';
import IPasswordRecoveryTokenRepository from '@modules/users/repositories/IPasswordRecoveryTokensRepository';
import PasswordRecoveryToken from '../entities/PasswordRecoveryToken';

class PasswordRecoveryTokensRepository
  implements IPasswordRecoveryTokenRepository {
  private ormRepository: Repository<PasswordRecoveryToken>;

  constructor() {
    this.ormRepository = getRepository(PasswordRecoveryToken);
  }

  public async findByToken(
    token: string,
  ): Promise<PasswordRecoveryToken | undefined> {
    const recoveryToken = await this.ormRepository.findOne({ where: token });

    return recoveryToken;
  }

  public async generate(user_id: string): Promise<PasswordRecoveryToken> {
    const recoveryToken = this.ormRepository.create({ user_id });

    await this.ormRepository.save(recoveryToken);

    return recoveryToken;
  }
}

export default PasswordRecoveryTokensRepository;
