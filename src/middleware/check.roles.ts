import { sequelize } from "../sequelize";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);

export const checkRole = (...roles: string[]) => {
  const funct = async (req: Request, res: Response, next: NextFunction) => {
    const user = await userSequelize.findOne({
      where: { email: req.user.reqEmail },
      attributes: ["id", "role_id", "email"],
      include: [{ model: roleSequelize, attributes: ["role_name"] }],
    });
    if (!user) return res.status(404).json({ Message: "User is not found." });
    if (!user || !roles.includes(user.role.role_name)) {
      return res.status(403).send({ error: { status: 403, message: "Access denied." } });
    }
    next();
  };
  return funct;
};
