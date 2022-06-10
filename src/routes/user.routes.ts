import router, { Application } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUsers,
  generateNewTokens,
  getInfoUser,
} from "../controllers/user.controllers";
import { authenticateAccessToken } from "../middleware/authorization.JWT";

export const userRouter: Application = router();

//user
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.all("/refresh", generateNewTokens); //? куди далі перейти ?
userRouter.post("/logout", logoutUser);
userRouter.post("/forgot-password", forgotPassword);
//userRouter.get("/reset-password/:link", resetPassword);
userRouter.post("/reset-password/:link", resetPassword);

//admin
userRouter.get("/profile", authenticateAccessToken, getInfoUser);
userRouter.get("/profile/admin-panel/list-managers", authenticateAccessToken);
userRouter.get("/profile/admin-panel/list-managers/:id", authenticateAccessToken);
userRouter.get("/profile/admin-panel/list-players", authenticateAccessToken);
userRouter.get("/profile/admin-panel/list-players/:id", authenticateAccessToken);

//manager

//player

//тестовий маршрут
userRouter.get("/users", authenticateAccessToken, getUsers);
