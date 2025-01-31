import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	month: number;
	year: number;
	day: number;
}

type IResponse = Array<{
	hour: number;
	available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
	constructor(
		@inject('AppointmentsRepository')
		private AppointmentsRepository: IAppointmentsRepository,
	) {}

	public async execute({
		provider_id,
		year,
		month,
		day,
	}: IRequest): Promise<IResponse> {
		const appointments = await this.AppointmentsRepository.findAllInDayFromProvider(
			{
				provider_id,
				year,
				month,
				day,
			},
		);

		const hourStart = 8;

		const eachHourArray = Array.from(
			{ length: 10 },
			(_, index) => index + hourStart,
		);

		const currentDate = new Date(Date.now());

		const availability = eachHourArray.map(hour => {
			const hasAppointmentInHour = appointments.find(
				appointment => getHours(appointment.date) === hour,
			);

			const compareDate = new Date(year, month - 1, day, hour);

			return {
				hour,
				available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
			};
		});

		return availability;
	}
}
