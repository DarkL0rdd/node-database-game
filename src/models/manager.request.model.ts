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
  IsInt,
  HasOne,
} from "sequelize-typescript";
import { User } from "../models/user.model";

export interface ManagerRequestAttributes {
  id: number;
  //user_id: number;
  request_type: string;
  status: string;
}

@Table({
  tableName: "Managers requests",
  timestamps: true,
  underscored: true,
})
export class ManagerRequest extends Model<ManagerRequest, ManagerRequestAttributes> {
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

  /*@Unique(true)
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;*/

  @HasOne(() => User, "manager_request_id")
  user: User;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  status: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
