import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { Ticket } from '../ticket/ticket.entity';
import { Problem } from '../problem/problem.entity';

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER })
  estimatedTime: number;

  @Column({
    type: DataType.INTEGER,
  })
  realTime: number;

  @Column({ type: DataType.BOOLEAN })
  addedOnTheFly: boolean;

  @BelongsTo(() => Ticket, 'ticketId')
  ticket: Ticket;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @HasMany(() => Problem, { foreignKey: 'taskId', onDelete: 'cascade', hooks: true })
  problems: Problem[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
