import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { DefaultTasksList } from '../defaultTasksList/defaultTasksList.entity';

@Table({ tableName: 'defaultTasks' })
export class DefaultTask extends Model<DefaultTask> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.TEXT })
  check: string;

  @Column({
    type: DataType.INTEGER,
  })
  estimatedTime: number;

  @ForeignKey(() => DefaultTasksList)
  @Column
  defaultTasksListId: number;

  @BelongsTo(() => DefaultTasksList, 'defaultTasksListId')
  defaultTasksList: DefaultTasksList;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
