import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user_model";

export const sequelize = new Sequelize(
  `${process.env.DB_NAME}`,
  `${process.env.DB_USER}`,
  `${process.env.DB_PASS}`,
  {
    dialect: "postgres",
    host: `${process.env.DB_HOST}`,
    port: +`${process.env.SERVER_PORT_DB}`,
    models: [User],
    repositoryMode: true,
    logging: false,
  }
);
