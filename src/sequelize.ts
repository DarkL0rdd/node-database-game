import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize(
  `${process.env.DB_NAME}`,
  `${process.env.DB_USER}`,
  `${process.env.DB_PASS}`,
  {
    dialect: "postgres",
    host: `${process.env.DB_HOST}`,
    port: +`${process.env.SERVER_PORT_DB}`,
    repositoryMode: true,
    models: [__dirname + "/models/**/*.model.js"],
    modelMatch: (filename, member) => {
      return (
        filename.substring(0, filename.indexOf(".model")) ===
        member.toLowerCase()
      );
    },
    logging: false,
  }
);
//models: [__dirname + "/models/**/*.model.js"], - змінити на цю строку якщо не працює імпорт моделей
sequelize
  .sync({ alter: true })
  .then(() => console.log("Sync is OK"))
  .catch((err) => {
    console.log(err);
  });
