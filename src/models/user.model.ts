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
import { Team } from "./team.model";
import { ManagerRequest } from "./manager.request.model";
import { PlayerRequest } from "./player.request.model";

export interface UserAttributes {
  id?: number;
  role_id?: number;
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
  status: string;
  refresh_token?: string;
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

  @AllowNull(true)
  @IsInt
  @ForeignKey(() => ManagerRequest)
  @Column({
    type: DataType.INTEGER,
  })
  manager_request_id: number;

  @BelongsTo(() => ManagerRequest, "manager_request_id")
  manager_request: ManagerRequest;

  @AllowNull(true)
  @IsInt
  @ForeignKey(() => PlayerRequest)
  @Column({
    type: DataType.INTEGER,
  })
  player_request_id: number;

  @BelongsTo(() => PlayerRequest, "player_request_id")
  player_request: PlayerRequest;

  @AllowNull(true)
  @IsInt
  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
  })
  team_id: number;

  @BelongsTo(() => Team, "team_id")
  team: Team;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  first_name: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  second_name: string;

  @AllowNull(false)
  @Unique(true)
  @NotEmpty
  @IsEmail
  @Column({
    type: DataType.STRING,
  })
  email: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  password: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  status: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  refresh_token: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
