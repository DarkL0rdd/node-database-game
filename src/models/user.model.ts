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
  NotEmpty,
  IsEmail,
  IsInt,
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
export class User extends Model<User, UserAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Unique(true)
  @AllowNull(false)
  @NotEmpty
  @IsInt
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(50),
  })
  first_name: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(50),
  })
  second_name: string;

  @AllowNull(false)
  @Unique(true)
  @NotEmpty
  @IsEmail
  @Column({
    type: DataType.STRING(50),
  })
  email: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(500),
  })
  password: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(500),
  })
  refresh_token: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
