import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Problem } from '../problem/problem.entity';
import { Project } from '../project/project.entity';

@Table({ tableName: 'problemCategory4-test' })
export class ProblemCategory extends Model<ProblemCategory> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @HasMany(() => Problem, 'ProblemCategoryId')
  problems: Problem[];

  @BelongsTo(() => Project, 'ProjectId')
  project: Project;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
