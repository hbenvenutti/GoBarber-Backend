import PasswordRecoveryToken from '@modules/users/infra/typeorm/entities/PasswordRecoveryToken';
import { uuid } from 'uuidv4';
import IPasswordRecoveryTokensRepository from '../IPasswordRecoveryTokensRepository';

class FakePasswordRecoveryTokensRepository
  implements IPasswordRecoveryTokensRepository {
  private passwordRecoveryTokens: PasswordRecoveryToken[] = [];

  public async generate(user_id: string): Promise<PasswordRecoveryToken> {
    const passwordRecoveryToken = new PasswordRecoveryToken();

    Object.assign(passwordRecoveryToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.passwordRecoveryTokens.push(passwordRecoveryToken);

    return passwordRecoveryToken;
  }
}

export default FakePasswordRecoveryTokensRepository;
