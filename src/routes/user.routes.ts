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
  showInfoAllUsers,
  showInfoByIdUser,
  banUserById,
  unbanUserById,
  giveNewRolePlayerToManager,
} from "../controllers/user.controllers";
import { authenticateAccessToken } from "../middleware/authorization.JWT";

export const userRouter: Application = router();

//user
userRouter.post("/register", registrationNewUser);
userRouter.post("/login", loginUser);
userRouter.all("/refresh", generateNewTokens); //? куди далі перейти ?
userRouter.post("/logout", logoutUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:link", resetPassword);

userRouter.get("/profile", authenticateAccessToken, showInfoUser);
userRouter.post("/profile/change-info", authenticateAccessToken, updateInfoUser);

//all
userRouter.get("/profile/:panel/:list", authenticateAccessToken, showInfoAllUsers); //admin-panel, manager-panel, player-panel | list-managers, list-players
userRouter.get("/profile/:panel/:list/:id", authenticateAccessToken, showInfoByIdUser);

//admin
userRouter.post("/profile/admin-panel/:list/:id/ban", authenticateAccessToken, banUserById); //list-managers, list-players
userRouter.post("/profile/admin-panel/:list/:id/unban", authenticateAccessToken, unbanUserById);
userRouter.post("/profile/admin-panel/list-players/:id", authenticateAccessToken, giveNewRolePlayerToManager); //giveNewRoleManagerToPlayer

userRouter.get("/profile/admin-panel/list-requests", authenticateAccessToken); //player's requests to join manager(approve or decline)
userRouter.get("/profile/admin-panel/list-requests/:id", authenticateAccessToken);
//delete player from team

userRouter.get("/profile/:panel/list-requests", authenticateAccessToken); //player's requests to join team(approve or decline)
userRouter.get("/profile/:panel/list-requests/:id", authenticateAccessToken);

//manager
userRouter.post("/profile/manager-panel/:id", authenticateAccessToken); //unban player //три функции на один путь
//delete player from team

//player
//userRouter.get("/profile/player-panel/list-reuests", authenticateAccessToken, showInfoManagers); //player's request to join team or request for unban

//test router
userRouter.get("/users", authenticateAccessToken, getUsers);
