import { Request, Response, NextFunction } from "express";
import { CustomError } from "../services/error.service";
import { sequelize } from "../sequelize";
import { User } from "../models/user.model";

const userSequelize = sequelize.getRepository(User);

export const compareUserEmail = () => {
  const funct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userEmail = await userSequelize.findOne({
        where: { email: req.body.email },
        attributes: ["email"],
      });
      if (userEmail?.email === req.body.email) {
        throw new CustomError(409, `User with email ${req.body.email} already exist.`);
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ Message: err.message });
    }
  };
  return funct;
};
