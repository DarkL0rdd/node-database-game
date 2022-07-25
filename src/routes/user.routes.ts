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
import { authenticateAccessToken, authenticateRefreshToken } from "../middleware/authorization.JWT";
import { checkRole } from "../middleware/check.roles";
import { validateQueryParameters } from "../middleware/validate.params";
import { validateRequestSchema } from "../middleware/validate.request.schema";
import { changeUserProfileSchema } from "../schema/change.user.profile.schema";
import { loginSchema } from "../schema/login.schema";
import { registrationSchema } from "../schema/registration.schema";
import { UserRole } from "../services/all.enums";

export const userRouter: Application = router();

//User
userRouter.post("/register", registrationSchema, validateRequestSchema, registrationNewUser);
userRouter.post("/login", loginSchema, validateRequestSchema, loginUser);
userRouter.all("/refresh", authenticateRefreshToken, generateNewTokens);
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
  validateQueryParameters(),
  showInfoAllUsersByRole
);
//All: Show one admin/manager/player by ID
userRouter.get(
  "/list-users/:id",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  validateQueryParameters(),
  showInfoUserByRoleAndId
);

//Admin: Ban manager/player by ID
userRouter.post("/list-users/:id/ban", authenticateAccessToken, checkRole(UserRole.Admin), validateQueryParameters(), banUser);
//Admin: Unban manager/player by ID
userRouter.post("/list-users/:id/unban", authenticateAccessToken, checkRole(UserRole.Admin), validateQueryParameters(), unbanUser);
