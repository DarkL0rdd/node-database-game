import router, { Application } from "express";
import {
  answerToRequest,
  cancelRequest,
  createNewRequest,
  showAllRequests,
  showOwnRequestById,
  showOwnRequests,
  showRequestById,
} from "../controllers/request.controllers";
import { authenticateAccessToken } from "../middleware/authorization.JWT";
import { checkRole } from "../middleware/check.roles";
import { UserRole } from "../services/all.enums";

export const requestRouter: Application = router();

//Manager, Player: Create new request
requestRouter.post(
  "/my-list-requests/new-request",
  authenticateAccessToken,
  checkRole(UserRole.Manager, UserRole.Player),
  createNewRequest
);

//Manager, Player: Show list of OWN requests
requestRouter.get("/my-list-requests", authenticateAccessToken, checkRole(UserRole.Manager, UserRole.Player), showOwnRequests);

//Manager, Player: Show OWN request by ID
requestRouter.get(
  "/my-list-requests/:id",
  authenticateAccessToken,
  checkRole(UserRole.Manager, UserRole.Player),
  showOwnRequestById
);

//Manager, Player: Cancel OWN request
requestRouter.post(
  "/my-list-requests/cancel-request/:id",
  authenticateAccessToken,
  checkRole(UserRole.Manager, UserRole.Player),
  cancelRequest
);

//Admin, Manager: Show list of requests managers/players
requestRouter.get("/list-requests", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager), showAllRequests);

//Admin, Manager: Show one requests by ID manager/player
requestRouter.get("/list-requests/:id", authenticateAccessToken, checkRole(UserRole.Admin, UserRole.Manager), showRequestById);

//Admin, Manager: Answer to request
requestRouter.post(
  "/list-requests/answer-request/:id",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager),
  answerToRequest
);
