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
  IsInt,
  HasMany,
  ForeignKey,
} from "sequelize-typescript";
import { DataType } from "sequelize-typescript";
import { User } from "../models/user.model";
export interface RoleAttributes {
  id: number;
  role: string;
}

@Table({
  tableName: "Roles",
  timestamps: true,
  underscored: true,
})
export class Role extends Model<Role, RoleAttributes> {
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

  @Unique(true)
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING(20),
  })
  role: string;

  /*@HasMany(() => User, "role_id")
  users: User[];*/

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
