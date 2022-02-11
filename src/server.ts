import express, { Application, Request, Response } from "express";
const app: Application = express();
const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Server is working on ${PORT} port`);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});

app.get("/echo", (req: Request, res: Response) => {
  res.status(200).send("Successful");
});
