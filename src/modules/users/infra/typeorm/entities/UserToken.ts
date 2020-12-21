import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Generated,
} from 'typeorm';

// Essa será nossa entidade de agendamento
@Entity('user_tokens') // a classe vira um parametro para o banco de dados
class UserToken {
	// definindo os atributos
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	@Generated('uuid')
	token: string;

	@Column()
	user_id: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
export default UserToken;
