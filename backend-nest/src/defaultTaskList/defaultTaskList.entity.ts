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
import { Project } from '../project/project.entity';
import { DefaultTask } from '../defaultTask/defaultTask.entity';

@Table({ tableName: 'defaulTaskList5-test' })
export class DefaultTaskList extends Model<DefaultTaskList> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM('BEGINNING', 'END'),
  })
  type: string;

  @BelongsTo(() => Project, 'projectId')
  project: Project;

  @HasMany(() => DefaultTask, 'defaultTaskListId')
  defaultTasks: DefaultTask[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
