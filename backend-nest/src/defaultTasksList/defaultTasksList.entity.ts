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
import { Project } from '../project/project.entity';
import { DefaultTask } from '../defaultTask/defaultTask.entity';

@Table({ tableName: 'defaultTasksLists' })
export class DefaultTasksList extends Model<DefaultTasksList> {
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

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @BelongsTo(() => Project, 'projectId')
  project: Project;

  @HasMany(() => DefaultTask, 'defaultTasksListId')
  defaultTasks: DefaultTask[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
