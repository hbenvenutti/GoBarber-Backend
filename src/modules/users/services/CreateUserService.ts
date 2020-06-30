import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const checkIfUserExists = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (checkIfUserExists) {
      throw new AppError('Email address already in use');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      password: hashedPassword,
      email,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
