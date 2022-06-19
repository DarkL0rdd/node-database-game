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
import { User } from "../models/user.model";

export interface TeamAttributes {
  id?: number;
  team_name: string;
}

@Table({
  tableName: "Teams",
  timestamps: true,
  underscored: true,
})
export class Team extends Model<Team, TeamAttributes> {
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
    type: DataType.STRING,
  })
  team_name: string;

  @HasMany(() => User, "team_id")
  users: User[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
