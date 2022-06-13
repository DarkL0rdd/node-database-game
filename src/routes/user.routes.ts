import router, { Application } from "express";
import {
  registrationNewUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUsers,
  generateNewTokens,
  showInfoUser,
  updateInfoUser,
  showInfoManagers,
  showInfoByIdManager,
  showInfoPlayers,
  showInfoByIdPlayer,
} from "../controllers/user.controllers";
import { authenticateAccessToken } from "../middleware/authorization.JWT";

export const userRouter: Application = router();

//user
userRouter.post("/register", registrationNewUser);
userRouter.post("/login", loginUser);
userRouter.all("/refresh", generateNewTokens); //? куди далі перейти ?
userRouter.post("/logout", logoutUser);
userRouter.post("/forgot-password", forgotPassword);
//userRouter.get("/reset-password/:link", resetPassword);
userRouter.post("/reset-password/:link", resetPassword);

userRouter.get("/profile", authenticateAccessToken, showInfoUser);
userRouter.post("/profile/change-info", authenticateAccessToken, updateInfoUser);

//admin
userRouter.get("/profile/admin-panel/list-managers", authenticateAccessToken, showInfoManagers);
userRouter.get("/profile/admin-panel/list-managers/:id", authenticateAccessToken, showInfoByIdManager);
userRouter.get("/profile/admin-panel/list-players", authenticateAccessToken, showInfoPlayers);
userRouter.get("/profile/admin-panel/list-players/:id", authenticateAccessToken, showInfoByIdPlayer);

//manager
userRouter.get("/profile/manager-panel/list-players", authenticateAccessToken, showInfoPlayers);
userRouter.get("/profile/manager-panel/list-players/:id", authenticateAccessToken, showInfoByIdPlayer);

//player

//тестовий маршрут
userRouter.get("/users", authenticateAccessToken, getUsers);
