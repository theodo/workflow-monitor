import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { ProblemCategory } from '../problemCategory/problemCategory.entity';

@Table({ tableName: 'projects' })
export class Project extends Model<Project> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.TEXT })
  name: string;

  @Column({ type: DataType.ENUM('NONE', 'TRELLO', 'JIRA') })
  thirdPartyType: string;

  @Column({ type: DataType.STRING, unique: true })
  thirdPartyId: string;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 6.0,
  })
  celerity: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 21600000,
  })
  dailyDevelopmentTime: number;

  @Column({
    type: DataType.ENUM('CASPR_TIME', 'CELERITY_TIME'),
    defaultValue: 'CASPR_TIME',
  })
  performanceType: string;

  @HasMany(() => User, 'currentProjectId')
  users: User[];

  @HasMany(() => ProblemCategory, 'projectId')
  problemCategories: ProblemCategory[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
