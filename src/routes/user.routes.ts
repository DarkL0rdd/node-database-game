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
  createNewRequest,
  showInfoAllUsersByRole,
  showInfoUserByRoleAndId,
} from "../controllers/user.controllers";
import { authenticateAccessToken } from "../middleware/authorization.JWT";
import { checkRole } from "../middleware/check.roles";
import { UserRole } from "../services/user.service";

export const userRouter: Application = router();

//!User
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

//!List of params: admin-panel, manager-panel, player-panel | list-admins, list-managers, list-players

userRouter.get(
  //!All: Show list of admins or managers or players
  "/profile/:panel/:list/",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  showInfoAllUsersByRole
);

userRouter.get(
  //!All: Show one admin or manager or player by ID
  "/profile/:panel/:list/:id",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  showInfoUserByRoleAndId
);

userRouter.post("/profile/admin-panel/:list/:id/ban", authenticateAccessToken, checkRole(UserRole.Admin), banUser); //!Admin: Ban manager or player by ID
userRouter.post("/profile/admin-panel/:list/:id/unban", authenticateAccessToken, checkRole(UserRole.Admin), unbanUser); //!Admin: Unban manager or player by ID

userRouter.post(
  //!Manager, Player: Create new request
  "/profile/:panel/my-list-requests/new-request",
  authenticateAccessToken,
  checkRole(UserRole.Manager, UserRole.Player),
  createNewRequest
);

//!Admin, Manager: Show list of requests(managers or players)
//userRouter.get("/profile/:panel/list-requests", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player), showAllRequests);
//!Admin, Manager: Show one requests by ID(manager or player)
//userRouter.get("/profile/:panel/list-requests/:id", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player), showRequestById);

//!Manager, Player: Show list of OWN requests
//userRouter.get("/profile/:panel/my-list-requests", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player), showAllRequests);
//!Manager, Player: Show OWN request by ID
//userRouter.get("/profile/:panel/my-list-requests/:id", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player), showRequestById);

//!Admin, Manager: Answer to request
//!Admin can ban/unban manager or player. Manager CANNOT ban/unban player
//userRouter.post("/profile/:panel/list-requests/:id", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager) answerToRequest);

//userRouter.get("/profile/:panel/list-teams", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player), showInfoAllUsers);//!All: Show list of teams
//userRouter.get("/profile/:panel/list-teams/:id", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player), showInfoByIdUser);//!All: Show team information by ID

//!Admin, Manager: Delete player from team
//userRouter.post("/profile/:panel/:list/:id/delete-from-team", authenticateAccessToken, checkRole(UserRole.Admin), deletePlayerFromTeam);

//!(Manager???), Player: Cancel request
//userRouter.post("/profile/:panel/my-list-requests/:id", authenticateAccessToken, checkRole(UserRole.Admin), cancelRequest);
