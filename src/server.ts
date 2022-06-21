import "dotenv/config";
import express, { Application, Request, Response } from "express";
import { sequelize } from "./sequelize";
import { createServer } from "http";
import { Server } from "socket.io";
import { userRouter } from "./routes/user.routes";
import cookieParser from "cookie-parser";
import { requestRouter } from "./routes/request.routes";

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 3600,
  },
});
const PORT: string | undefined = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
httpServer.listen(3000, () => {
  console.log(`Server is working on ${PORT} port`);
});

/*app.listen(PORT, () => {
  console.log(`Server is working on ${PORT} port`);
});*/

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use("/user", userRouter);
app.use("/request", requestRouter);

app.use(express.static("src/html"));

app.get("/echo", (req: Request, res: Response) => {
  res.status(200).send("Successful");
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("Error 404");
});
