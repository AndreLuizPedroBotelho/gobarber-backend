import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import { container } from 'tsyringe';
import { Response, Request } from 'express';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listProviders = container.resolve(ListProvidersService);

    const appointment = await listProviders.execute({
      user_id,
    });

    return response.json(appointment);
  }
}
