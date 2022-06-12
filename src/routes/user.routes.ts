import router, { Application } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUsers,
  generateNewTokens,
  showInfoUser,
  updateInfoUser,
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

userRouter.get("/profile", authenticateAccessToken, showInfoUser);
userRouter.post("/profile/change-info", authenticateAccessToken, updateInfoUser);

//admin
userRouter.get("/profile/admin-panel/list-managers", authenticateAccessToken);
userRouter.get("/profile/admin-panel/list-managers/:manager-id", authenticateAccessToken);
userRouter.get("/profile/admin-panel/list-players", authenticateAccessToken);
userRouter.get("/profile/admin-panel/list-players/:player-id", authenticateAccessToken);

//manager

//player

//тестовий маршрут
userRouter.get("/users", authenticateAccessToken, getUsers);
