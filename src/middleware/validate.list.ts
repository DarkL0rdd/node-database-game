import { Request, Response, NextFunction } from "express";
import { UserRole, Panel, List } from "../services/all.enums";
import { CustomError } from "../services/error.service";

// /profile/:panel/:list/

// /profile/admin-panel/:list
// /profile/manager-panel/:list
// /profile/player-panel/:list

// Admin:
// /profile/admin-panel/list-admins
// /profile/admin-panel/list-managers
// /profile/admin-panel/list-players

export const validatePanel = () => {
  const funct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = res.locals.userRole;
      console.log("ROLE: " + userRole);
      if (req.params.panel === Panel.AdminPanel && userRole === UserRole.Admin) {
        console.log("validatePanelAdmin");
        if (
          req.params.list === List.AdminList ||
          req.params.list === List.ManagerList ||
          req.params.list === List.PlayerList ||
          req.params.list === List.TeamList
        ) {
          console.log(req.params.list);
          next();
        }
      } else if (req.params.panel === Panel.ManagerPanel && userRole === UserRole.Manager) {
        console.log("validatePanelManager");
        if (
          req.params.list === List.AdminList ||
          req.params.list === List.ManagerList ||
          req.params.list === List.PlayerList ||
          req.params.list === List.TeamList
        ) {
          console.log(req.params.list);
          next();
        }
      } else if (req.params.panel === Panel.PlayerPanel && userRole === UserRole.Player) {
        console.log("validatePanelPlayer");
        if (
          req.params.list === List.AdminList ||
          req.params.list === List.ManagerList ||
          req.params.list === List.PlayerList ||
          req.params.list === List.TeamList
        ) {
          console.log(req.params.list);
          next();
        }
      } else {
        throw new CustomError(403, "Route error.");
      }
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ Message: err.message });
    }
  };
  return funct;
};
