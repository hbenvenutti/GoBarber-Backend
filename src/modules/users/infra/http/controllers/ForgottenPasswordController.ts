import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotenPasswordEmailService from '@modules/users/services/SendForgotenPasswordEmailService';

class ForgottenPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const sendEmail = container.resolve(SendForgotenPasswordEmailService);

    await sendEmail.execute(email);

    return response.status(204).json();
  }
}

export default ForgottenPasswordController;
