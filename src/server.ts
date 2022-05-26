import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import { sequelize } from "./sequelize";
import * as socketio from "socket.io";
import { userRouter } from "./routes/user.routes";
import cookieParser from "cookie-parser";

const app: Application = express();
const PORT: string | undefined = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.listen(PORT, () => {
  console.log(`Server is working on ${PORT} port`);
});

app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Start page");
});

app.get("/echo", (req: Request, res: Response) => {
  res.status(200).send("Successful");
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("Error 404");
});
