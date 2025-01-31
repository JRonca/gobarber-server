import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router(); // Criando a rota
const sessionsController = new SessionsController();

sessionsRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			email: Joi.string().required().email(),
			password: Joi.string().required(),
		},
	}),
	sessionsController.create,
);

export default sessionsRouter;
