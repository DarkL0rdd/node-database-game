import { Request, Response, NextFunction } from "express";
import { UserRole, Panel, ParamsList } from "../services/all.enums";
import { CustomError } from "../services/error.service";

// /profile/:panel/:list/

// /profile/admin-panel/:list
// /profile/manager-panel/:list
// /profile/player-panel/:list

// Admin:
// /profile/admin-panel/list-admins
// /profile/admin-panel/list-managers
// /profile/admin-panel/list-players

//! List of params: admin-panel, manager-panel, player-panel |
//! list-admins, list-managers, list-players,
//! list-teams,
//! list-requests, my-list-requests

// /profile/:panel/:list/

export const validatePanel = () => {
  const funct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = res.locals.userRole;
      console.log("ROLE: " + userRole);

      const objRoles: any = {
        [UserRole.Admin]: [Panel.AdminPanel],
        [UserRole.Manager]: [Panel.ManagerPanel],
        [UserRole.Player]: [Panel.PlayerPanel],
      };

      const paramList: ParamsList = req.params.list as ParamsList;
      if (objRoles[userRole].includes(req.params.panel) && Object.values(ParamsList).includes(paramList)) {
        next();
      } else {
        throw new CustomError(403, "Route error.");
      }

      /*if (req.params.panel === Panel.AdminPanel && userRole === UserRole.Admin) {
        console.log("validatePanelAdmin");
        if (
          req.params.list === ParamsList.AdminList ||
          req.params.list === ParamsList.ManagerList ||
          req.params.list === ParamsList.PlayerList ||
          req.params.list === ParamsList.TeamList
        ) {
          console.log(req.params.list);
          next();
        } else {
          throw new CustomError(403, "Route error.");
        }
      } else if (req.params.panel === Panel.ManagerPanel && userRole === UserRole.Manager) {
        console.log("validatePanelManager");
        if (
          req.params.list === ParamsList.AdminList ||
          req.params.list === ParamsList.ManagerList ||
          req.params.list === ParamsList.PlayerList ||
          req.params.list === ParamsList.TeamList ||
          req.params.list === ParamsList.MyList
        ) {
          console.log(req.params.list);
          next();
        } else {
          throw new CustomError(403, "Route error.");
        }
      } else if (req.params.panel === Panel.PlayerPanel && userRole === UserRole.Player) {
        console.log("validatePanelPlayer");
        if (
          req.params.list === ParamsList.AdminList ||
          req.params.list === ParamsList.ManagerList ||
          req.params.list === ParamsList.PlayerList ||
          req.params.list === ParamsList.TeamList ||
          req.params.list === ParamsList.MyList
        ) {
          console.log(req.params.list);
          next();
        } else {
          throw new CustomError(403, "Route error.");
        }
      } else {
        throw new CustomError(403, "Route error.");
      }*/
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ Message: err.message });
    }
  };
  return funct;
};
