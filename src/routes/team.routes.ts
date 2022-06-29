import router, { Application } from "express";
import { authenticateAccessToken } from "../middleware/authorization.JWT";
import { checkRole } from "../middleware/check.roles";
import { UserRole } from "../services/all.enums";
import { deletePlayerFromTeam, showInfoAllTeams, showInfoTeamById } from "../controllers/team.controllers";

export const teamRouter: Application = router();

//All: Show list of teams
teamRouter.get(
  "/list-teams",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  showInfoAllTeams
);
//All: Show team information by ID
teamRouter.get(
  "/list-teams/:id",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager, UserRole.Player),
  showInfoTeamById
);

//?Admin, Manager: Delete player from team
teamRouter.post(
  "/list-teams/delete-from-team/:id",
  authenticateAccessToken,
  checkRole(UserRole.Admin, UserRole.Manager),
  deletePlayerFromTeam
);
