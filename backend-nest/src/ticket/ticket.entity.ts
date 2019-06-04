import { Table, Column, Model, DataType, HasMany, BelongsTo } from 'sequelize-typescript';
import { Task } from 'src/task/task.entity';
import { User } from 'src/user/user.entity';

@Table({ tableName: 'ticket-test' })
export class Ticket extends Model<Ticket> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING })
  thirdPartyId: string;

  @Column({
    type: DataType.INTEGER,
  })
  complexity: number;

  @Column({ type: DataType.ENUM('PLANNING', 'DONE'), allowNull: false })
  status: string;

  @Column({
    type: DataType.INTEGER,
  })
  points: number;

  @Column({
    type: DataType.FLOAT,
  })
  celerity: number;

  @Column({
    type: DataType.INTEGER,
  })
  dailyDevelopmentTime: number;

  @Column({
    type: DataType.INTEGER,
  })
  allocatedTime: number;

  @Column({
    type: DataType.INTEGER,
  })
  estimatedTime: number;

  @Column({
    type: DataType.INTEGER,
  })
  realTime: number;

  @HasMany(() => Task, 'ticketId')
  tasks: Task[];

  @BelongsTo(() => User, 'userId')
  user: User;

  // @BelongsTo(() => Project, 'projectId')
  // project: Project;

  // TODO: implement
  // ticket.associate = function(models) {
  //   ticket.belongsTo(models.project, { as: 'project' });
  //   ticket.belongsTo(models.user, { as: 'user' });
  //   ticket.hasMany(models.task, { as: 'tasks' });
  // };
}
