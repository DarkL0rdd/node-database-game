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
  banManagerById,
  unbanManagerById,
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

//all
userRouter.get("/profile/:panel/list-players", authenticateAccessToken, showInfoPlayers);
userRouter.get("/profile/:panel/list-players/:id", authenticateAccessToken, showInfoByIdPlayer);

//admin
userRouter.get("/profile/admin-panel/list-managers", authenticateAccessToken, showInfoManagers);
userRouter.get("/profile/admin-panel/list-managers/:id", authenticateAccessToken, showInfoByIdManager);
userRouter.post("/profile/admin-panel/list-managers/:id", authenticateAccessToken, banManagerById);
//add ban or unban manager/player
//player's requests to join manager(approve or decline)
userRouter.get("/profile/admin-panel/list-requests", authenticateAccessToken);
userRouter.get("/profile/admin-panel/list-requests/:id", authenticateAccessToken);
//delete player from team

//manager
userRouter.get("/profile/manager-panel/list-requests", authenticateAccessToken); //player's requests to join team(approve or decline)
userRouter.get("/profile/manager-panel/list-requests/:id", authenticateAccessToken);
userRouter.post("/profile/manager-panel/:id", authenticateAccessToken, unbanManagerById); //unban player //три функции на одну путь
//delete player from team

//player
userRouter.get("/profile/player-panel/list-players", authenticateAccessToken, showInfoPlayers);
userRouter.get("/profile/player-panel/list-players/:id", authenticateAccessToken, showInfoByIdPlayer);

userRouter.get("/profile/player-panel/list-reuests", authenticateAccessToken, showInfoManagers); //player's request to join team or request for unban

//тестовий маршрут
userRouter.get("/users", authenticateAccessToken, getUsers);
