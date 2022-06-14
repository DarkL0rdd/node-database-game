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
import { ManagerRequest } from "./manager.request.model";
import { PlayerRequest } from "./player.request.model";

export interface UserAttributes {
  id?: number;
  role_id: number;
  manager_request_id?: number;
  manager_request?: ManagerRequest;
  player_request_id?: number;
  player_request?: PlayerRequest;
  team_id?: number;
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

  //@AllowNull(false)
  @IsInt
  @ForeignKey(() => ManagerRequest)
  @Column({
    type: DataType.INTEGER,
  })
  manager_request_id: number;

  @BelongsTo(() => ManagerRequest, "manager_request_id")
  manager_request: ManagerRequest;

  //@AllowNull(false)
  @IsInt
  @ForeignKey(() => PlayerRequest)
  @Column({
    type: DataType.INTEGER,
  })
  player_request_id: number;

  @BelongsTo(() => PlayerRequest, "player_request_id")
  player_request: PlayerRequest;

  @AllowNull(false)
  @IsInt
  @Column({
    type: DataType.INTEGER,
  })
  team_id: number;

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
