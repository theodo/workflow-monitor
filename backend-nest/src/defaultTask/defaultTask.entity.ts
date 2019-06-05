import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { DefaultTaskList } from '../defaultTaskList/defaultTaskList.entity';

@Table({ tableName: 'defaultTask5-test' })
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

  @BelongsTo(() => DefaultTaskList, 'defaultTaskListId')
  defaultTaskList: DefaultTaskList;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
