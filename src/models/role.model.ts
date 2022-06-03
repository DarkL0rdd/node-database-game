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
} from "sequelize-typescript";
import { DataType } from "sequelize-typescript";

export interface RoleAttributes {
  id: number;
  role: string;
  description: string;
}

@Table({
  tableName: "Roles",
  timestamps: true,
  underscored: true,
})
export class Role extends Model<RoleAttributes> implements RoleAttributes {
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

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  description: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
