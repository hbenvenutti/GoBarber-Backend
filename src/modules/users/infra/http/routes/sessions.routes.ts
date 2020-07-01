import { Router } from 'express';

import CreateSessionService from '@modules/users/services/CreateSessionService';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const usersRepository = new UsersRepository();
  const { email, password } = request.body;
  const createSession = new CreateSessionService(usersRepository);

  const { user, token } = await createSession.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionRouter;
