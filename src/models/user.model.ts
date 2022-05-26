import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  Unique,
  Default,
} from "sequelize-typescript";
import { DataType } from "sequelize-typescript";

export interface UserAttributes {
  id?: number;
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  refresh_token: string;
}

@Table({
  tableName: "Users",
  timestamps: true,
  underscored: true,
})
export class User extends Model<UserAttributes> implements UserAttributes {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  first_name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  second_name: string;

  @AllowNull(false)
  @Unique(true)
  @Column({
    type: DataType.STRING(50),
  })
  email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(150),
  })
  password: string;

  @Unique(false) //?!
  @AllowNull(true)
  @Default("null")
  @Column({
    type: DataType.STRING,
  })
  refresh_token: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
