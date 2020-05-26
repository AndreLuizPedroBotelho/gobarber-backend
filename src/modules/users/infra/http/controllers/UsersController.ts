import { container } from 'tsyringe';
import { Response, Request } from 'express';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUsers = container.resolve(CreateUserService);

    const user = await createUsers.execute({
      name,
      email,
      password,
    });
    return response.json(classToClass(user));
  }
}
