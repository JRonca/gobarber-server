import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	// recebimento de informações
	provider_id: string;
	user_id: string;
	date: Date;
}
@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,

		@inject('NotificationsRepository')
		private notificationsRepository: INotificationsRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({
		provider_id,
		date,
		user_id,
	}: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date);
		// zera os minutos e segundos
		// não permitindo agendamentos em datas quebradas
		if (isBefore(appointmentDate, Date.now())) {
			throw new AppError("You can't create an appointment on a past date.");
		}
		if (user_id === provider_id) {
			throw new AppError("You can't create an appointment with yourself.");
		}
		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
			throw new AppError("You can't create appointments between 5pm and 8am.");
		}
		const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
			appointmentDate,
			provider_id,
		); // verifica a validade da data
		if (findAppointmentInSameDate) {
			throw new AppError('This appointment is already booked');
		} // caso não seja valida ele executa a exceção que será tratada na rota
		const appointment = await this.appointmentsRepository.create({
			// cria a instancia do appointment usando o repositório typeorm
			// porém não salva no bd
			provider_id,
			user_id,
			date: appointmentDate,
		}); // cria o appointment usando o repositório

		const dateFormat = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

		await this.notificationsRepository.create({
			recipient_id: provider_id,
			content: `Novo agendamento para ${dateFormat}`,
		});

		await this.cacheProvider.invalidate(
			`provider-appointments:${provider_id}:${format(
				appointmentDate,
				'yyyy-M-d',
			)}`,
		);

		return appointment; // retorna o appointment para as rotas
	}
}
export default CreateAppointmentService;
