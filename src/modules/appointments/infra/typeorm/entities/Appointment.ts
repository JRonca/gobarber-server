import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
// KISS - Keep It Simple & Stupid
import User from '@modules/users/infra/typeorm/entities/User';
// Essa será nossa entidade de agendamento
@Entity('appointments') // a classe vira um parametro para o banco de dados
class Appointment {
	// definindo os atributos
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	provider_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'provider_id' })
	provider: User;

	@Column()
	user_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column('timestamp with time zone')
	date: Date;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
export default Appointment;
