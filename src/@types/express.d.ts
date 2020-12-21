declare namespace Express {
	export interface Request {
		user: {
			id: string;
		};
	}
} // adicionando o user ao request do express
