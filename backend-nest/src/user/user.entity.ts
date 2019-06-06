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
import { Project } from '../project/project.entity';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
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

  @ForeignKey(() => Project)
  @Column
  currentProjectId: number;

  @BelongsTo(() => Project, 'currentProjectId')
  currentProject: Project;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
