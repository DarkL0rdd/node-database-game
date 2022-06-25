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
import { validateQueryParametrs } from "../middleware/validate.params";
import { UserRole } from "../services/all.enums";

export const userRouter: Application = router();

//User
userRouter.post("/register", registrationNewUser);
userRouter.post("/login", loginUser);
userRouter.all("/refresh", generateNewTokens);
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

//List of query params: admin, manager, player
// /?role=admin

//All: Show list of admins/managers/players
userRouter.get(
  "/list-users",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  validateQueryParametrs(),
  showInfoAllUsersByRole
);
//All: Show one admin/manager/player by ID
userRouter.get(
  "/list-users/:id",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  validateQueryParametrs(),
  showInfoUserByRoleAndId
);

//Admin: Ban manager/player by ID
userRouter.post("/list-users/:id/ban", authenticateAccessToken, checkRole(UserRole.Admin), validateQueryParametrs(), banUser);
//Admin: Unban manager/player by ID
userRouter.post("/list-users/:id/unban", authenticateAccessToken, checkRole(UserRole.Admin), validateQueryParametrs(), unbanUser);
