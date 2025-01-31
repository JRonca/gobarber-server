import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let UpdateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeStorageProvider = new FakeStorageProvider();

		UpdateUserAvatar = new UpdateUserAvatarService(
			fakeUsersRepository,
			fakeStorageProvider,
		);
	});
	it('should be able to update a user avatar', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		await UpdateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar.jpg',
		});

		expect(user.avatar).toBe('avatar.jpg');
	});
	it('should not be able to update avatar from non existenting user', async () => {
		await expect(
			UpdateUserAvatar.execute({
				user_id: 'non-existing-user',
				avatarFileName: 'avatar.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should delete old avatar when updating new one', async () => {
		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		await UpdateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar.jpg',
		});
		await UpdateUserAvatar.execute({
			user_id: user.id,
			avatarFileName: 'avatar2.jpg',
		});

		expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

		expect(user.avatar).toBe('avatar2.jpg');
	});
});
