import { Request, Response, NextFunction } from "express";
import { UserRole } from "../services/all.enums";
import { CustomError } from "../services/error.service";

export const validateQueryParametrs = () => {
  const funct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryRole: UserRole = req.query.role as UserRole;
      if (Object.values(UserRole).toString().toLowerCase().includes(queryRole)) {
        next();
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
