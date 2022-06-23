import router, { Application } from "express";
import { authenticateAccessToken } from "../middleware/authorization.JWT";
import { checkRole } from "../middleware/check.roles";
import { validatePanel } from "../middleware/validate.list";
import { UserRole } from "../services/all.enums";
import { deletePlayerFromTeam, showInfoAllTeams, showInfoTeamById } from "../controllers/team.controllers";

export const teamRouter: Application = router();

//!List of params: admin-panel, manager-panel, player-panel | list-admins, list-managers, list-players, list-teams, list-requests, my-list-requests

//All: Show list of teams
teamRouter.get(
  "/profile/:panel/:list",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  validatePanel(),
  showInfoAllTeams
);
//All: Show team information by ID
teamRouter.get(
  "/profile/:panel/:list/:id",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  validatePanel(),
  showInfoTeamById
);

//?Admin, Manager: Delete player from team
teamRouter.post(
  "/profile/:panel/:list/:id/delete-from-team",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager),
  validatePanel(),
  deletePlayerFromTeam
);
