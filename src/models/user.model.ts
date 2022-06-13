import {
  DataType,
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
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Role } from "../models/role.model";

export interface UserAttributes {
  id?: number;
  role_id: number;
  role?: Role;
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
  @IsInt
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
  })
  role_id: number;

  @BelongsTo(() => Role, "role_id")
  role: Role;

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
