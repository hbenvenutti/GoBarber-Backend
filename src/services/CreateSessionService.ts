import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import User from '../models/User';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: User;
}

class CreateSessionService {
  public async execute({ email, password }: RequestDTO): Promise<ResponseDTO> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('User does not exist');
    }

    const passwordMatch = compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Password does not match');
    }

    return { user };
  }
}

export default CreateSessionService;
