import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users-test' })
export class User extends Model<User> {
  @Column({
    type: DataType.NUMERIC,
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
}
