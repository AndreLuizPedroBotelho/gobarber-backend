import CreateAppointmentsService from '@modules/appointments/services/CreateAppointmentsService';
import { container } from 'tsyringe';
import { Response, Request } from 'express';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { provider_id, date } = request.body;

    const createAppointments = container.resolve(CreateAppointmentsService);

    const appointment = await createAppointments.execute({
      date,
      user_id,
      provider_id,
    });

    return response.json(appointment);
  }
}
