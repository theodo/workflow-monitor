import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Ticket } from 'src/ticket/ticket.entity';

@Table({ tableName: 'users-test' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true })
  trelloId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @Column({
    type: DataType.TEXT,
  })
  state: string;

  @HasMany(() => Ticket, 'userId')
  tickets: Ticket[];
}
