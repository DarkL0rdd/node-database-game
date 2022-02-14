require("dotenv").config();
import express, { Application, Request, Response } from "express";
const app: Application = express();
const PORT: string | undefined = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server is working on ${PORT} port`);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});

app.get("/echo", (req: Request, res: Response) => {
  res.status(200).send("Successful");
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("Error 404");
});
