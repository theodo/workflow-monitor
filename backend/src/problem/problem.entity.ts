import {
  CreatedAt,
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { Task } from '../task/task.entity';
import { ProblemCategory } from '../problemCategory/problemCategory.entity';

@Table({ tableName: 'problems' })
export class Problem extends Model<Problem> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ForeignKey(() => ProblemCategory)
  @Column
  problemCategoryId: number;

  @ForeignKey(() => Task)
  @Column
  taskId: number;

  @BelongsTo(() => ProblemCategory, 'problemCategoryId')
  problemCategory: ProblemCategory;

  @BelongsTo(() => Task, { foreignKey: 'taskId', onDelete: 'cascade' })
  task: Task;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
