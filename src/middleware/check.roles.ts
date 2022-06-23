import { sequelize } from "../sequelize";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { CustomError } from "../services/error.service";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);

export const checkRole = (...roles: string[]) => {
  const funct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userSequelize.findOne({
        where: { email: req.user.reqEmail },
        attributes: ["id", "role_id", "email"],
        include: [{ model: roleSequelize, attributes: ["role_name"] }],
      });
      if (!user) throw new CustomError(404, "User is not found.");
      if (!roles.includes(user.role.role_name)) throw new CustomError(403, "You don't have permission to access this page.");
      res.locals.userRole = user.role.role_name;
      console.log("checkRole");
      next();
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ Message: err.message });
    }
  };
  return funct;
};
