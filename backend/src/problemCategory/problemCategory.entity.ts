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
import { Problem } from '../problem/problem.entity';
import { Project } from '../project/project.entity';

@Table({ tableName: 'problemCategories' })
export class ProblemCategory extends Model<ProblemCategory> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @HasMany(() => Problem, 'problemCategoryId')
  problems: Problem[];

  @BelongsTo(() => Project, 'projectId')
  project: Project;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
