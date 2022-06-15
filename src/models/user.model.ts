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
import { Request } from "./request.model";

export interface UserAttributes {
  id?: number;
  role_id?: number;
  role?: Role;
  user_request_id?: number;
  user_request?: Request;
  team_id?: number;
  team?: Team;
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  status: string;
  reason?: string;
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
  @ForeignKey(() => Request)
  @Column({
    type: DataType.INTEGER,
  })
  user_request_id: number;

  @BelongsTo(() => Request, "user_request_id")
  user_request: Request;

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
  reason: string;

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
