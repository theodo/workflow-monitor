import { Table, Column, Model, DataType, HasMany, BelongsTo } from 'sequelize-typescript';
import { Ticket } from 'src/ticket/ticket.entity';

@Table({ tableName: 'task-test' })
export class Task extends Model<Task> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
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

  // @HasMany(() => Problem, 'taskId')
  // TODO: implement :
  // task.associate = function(models) {
  //   task.hasMany(models.problem, { as: 'problems', onDelete: 'cascade', hooks: true });
  // };
}
