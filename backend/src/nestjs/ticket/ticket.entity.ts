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
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Table({ tableName: 'tickets' })
export class Ticket extends Model<Ticket> {
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
    type: DataType.STRING,
  })
  trelloId: string;

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

  @BelongsTo(() => Project, 'projectId')
  project: Project;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
