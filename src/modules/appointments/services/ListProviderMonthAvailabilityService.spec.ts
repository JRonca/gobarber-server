// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('List Provider Month Availability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
			fakeAppointmentsRepository,
		);
	});
	it('should be able to list the month availability from provider', async () => {
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 8, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 9, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 10, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 11, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 12, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 13, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 14, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 15, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 16, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 22, 17, 0, 0),
		});
		await fakeAppointmentsRepository.create({
			provider_id: 'user',
			user_id: 'client',
			date: new Date(2020, 11, 20, 10, 0, 0),
		});

		const availability = await listProviderMonthAvailability.execute({
			provider_id: 'user',
			year: 2020,
			month: 12,
		});

		expect(availability).toEqual(
			expect.arrayContaining([
				{ day: 21, available: true },
				{ day: 22, available: false },
				{ day: 23, available: true },
				{ day: 24, available: true },
			]),
		);
	});
});
