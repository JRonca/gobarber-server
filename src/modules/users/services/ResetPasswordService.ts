import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
// import { differenceInHours } from 'date-fns';

// import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../provider/HashProvider/models/IHashProvider';

interface IRequest {
	token: string;
	password: string;
}
@injectable()
export default class ResetPasswordService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('UserTokensRepository')
		private uerTokensRepository: IUserTokensRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({ token, password }: IRequest): Promise<void> {
		const userToken = await this.uerTokensRepository.findByToken(token);
		if (!userToken) {
			throw new AppError('User token does not exists');
		}
		const user = await this.usersRepository.findById(userToken.user_id);

		if (!user) {
			throw new AppError('User does not exists');
		}

		const tokenCreatedAt = userToken.created_at;
		const compareDate = addHours(tokenCreatedAt, 2);

		if (isAfter(Date.now(), compareDate)) {
			throw new AppError('Token expired');
		}

		// Funcionou pra mim, mas pro Diego não
		// acho que a função não gosta dele hahahaha
		// if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
		// 	throw new AppError('Token expired');
		// }

		user.password = await this.hashProvider.generateHash(password);

		await this.usersRepository.save(user);
	}
}
