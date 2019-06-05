import {
  CreatedAt,
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  UpdatedAt,
} from 'sequelize-typescript';
import { Task } from '../task/task.entity';
import { ProblemCategory } from '../problemCategory/problemCategory.entity';

@Table({ tableName: 'problem4-test' })
export class Problem extends Model<Problem> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @BelongsTo(() => ProblemCategory, 'ProblemCategoryId')
  problemCategory: ProblemCategory;

  // TODO: check where to add the { onDelete: 'cascade' } info
  @BelongsTo(() => Task, 'TaskId')
  task: Task;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
