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
} from "sequelize-typescript";
import { User } from "./user.model";

export interface RequestAttributes {
  id: number;
  request_type: string;
  status: string;
}

@Table({
  tableName: "Requests",
  timestamps: true,
  underscored: true,
})
export class Request extends Model<Request, RequestAttributes> {
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
  @Column({
    type: DataType.STRING,
  })
  request_type: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  status: string;

  @HasMany(() => User, "user_request_id")
  user: User[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
