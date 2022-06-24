import router, { Application } from "express";
import {
  registrationNewUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  generateNewTokens,
  showInfoUserProfile,
  updateInfoUserProfile,
  banUser,
  unbanUser,
  showInfoAllUsersByRole,
  showInfoUserByRoleAndId,
} from "../controllers/user.controllers";
import { authenticateAccessToken } from "../middleware/authorization.JWT";
import { checkRole } from "../middleware/check.roles";
import { validatePanel } from "../middleware/validate.params";
import { UserRole } from "../services/all.enums";

export const userRouter: Application = router();

//User
userRouter.post("/register", registrationNewUser);
userRouter.post("/login", loginUser);
userRouter.all("/refresh", generateNewTokens); //? куди далі перейти ?
userRouter.post("/logout", logoutUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:link", resetPassword);
userRouter.get(
  "/profile",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  showInfoUserProfile
);
userRouter.post(
  "/profile/change-info",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  updateInfoUserProfile
);

//!List of params: admin-panel, manager-panel, player-panel | list-admins, list-managers, list-players, list-teams, list-requests, my-list-requests

//All: Show list of admins/managers/players
userRouter.get(
  "/profile/:panel/:list",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  validatePanel(),
  showInfoAllUsersByRole
);
//All: Show one admin/manager/player by ID
userRouter.get(
  "/profile/:panel/:list/:id",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  validatePanel(),
  showInfoUserByRoleAndId
);

//Admin: Ban manager/player by ID
userRouter.post("/profile/admin-panel/:list/:id/ban", authenticateAccessToken, checkRole(UserRole.Admin), banUser);
//Admin: Unban manager/player by ID
userRouter.post("/profile/admin-panel/:list/:id/unban", authenticateAccessToken, checkRole(UserRole.Admin), unbanUser);
