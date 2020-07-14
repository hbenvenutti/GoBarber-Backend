import PasswordRecoveryToken from '../infra/typeorm/entities/PasswordRecoveryToken';

// Token to validate user on password recovery
export default interface IPasswordRecoveryTokenRepository {
  generate(user_id: string): Promise<PasswordRecoveryToken>;
  findByToken(token: string): Promise<PasswordRecoveryToken | undefined>;
}
