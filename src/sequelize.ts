import { Sequelize } from "sequelize-typescript";
export const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, process.env.DB_PASS, {
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: +`${process.env.SERVER_PORT_DB}`,
  repositoryMode: true,
  logging: false,
  models: [__dirname + "/models/**/*.model.ts"],
  modelMatch: (filename, member) => {
    console.log(filename, member);
    return filename.substring(0, filename.indexOf(".model")) === member.toLowerCase();
  },
});
