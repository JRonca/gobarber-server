import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const user_id = request.user.id;
		const { provider_id, date } = request.body; // pegando os parametro da requisição no corpo
		const createAppointment = container.resolve(CreateAppointmentService);
		// criando o service e passando o repositório
		const appointment = await createAppointment.execute({
			date,
			provider_id,
			user_id,
		}); // criando o appointment com o service
		return response.json(appointment); // retornando o appointment
	}
}
