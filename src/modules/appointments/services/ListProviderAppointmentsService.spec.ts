// import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('List Provider Appointments Service', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeCacheProvider = new FakeCacheProvider();
		listProviderAppointments = new ListProviderAppointmentsService(
			fakeAppointmentsRepository,
			fakeCacheProvider,
		);
	});
	it('should be able to list the appointments on a specific day', async () => {
		const appointment1 = await fakeAppointmentsRepository.create({
			provider_id: 'provider',
			user_id: 'client',
			date: new Date(2020, 11, 22, 14, 0, 0),
		});
		const appointment2 = await fakeAppointmentsRepository.create({
			provider_id: 'provider',
			user_id: 'client',
			date: new Date(2020, 11, 22, 15, 0, 0),
		});

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 11, 22, 11).getTime();
		});

		const availability = await listProviderAppointments.execute({
			provider_id: 'provider',
			year: 2020,
			month: 12,
			day: 22,
		});

		expect(availability).toEqual([appointment1, appointment2]);
	});
});
