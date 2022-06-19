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
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.model";

export interface UserRequestAttributes {
  id?: number;
  user_id: number;
  request_type: string;
  description: string;
  status: string;
}

@Table({
  tableName: "Requests",
  timestamps: true,
  underscored: true,
})
export class UserRequest extends Model<UserRequest, UserRequestAttributes> {
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
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  user_id: number;

  @BelongsTo(() => User, "user_id")
  user: User;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  request_type: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  description: string;

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
