import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);

export const hashUserPassword = async (reqPassword: string, salRounds: number) => {
  if (reqPassword) {
    return bcrypt.hashSync(reqPassword, salRounds);
  }
  throw new CustomError(500, "Error password.");
};

export const compareUserPassword = async (reqEmail: string, reqPassword: string) => {
  const passwordFind = await userSequelize.findOne({
    where: { email: reqEmail },
    attributes: ["password"],
  });
  if (!passwordFind) throw new CustomError(401, "Email is incorrect.");
  const hashCompare: boolean = bcrypt.compareSync(reqPassword, passwordFind.password);
  if (!hashCompare) throw new CustomError(403, "Password is incorrect.");
};

export const generateLinkEmail = async (userEmail: string) => {
  const token = jwt.sign({ userEmail }, `${process.env.ACCESS_SECRET_KEY}`, {
    expiresIn: "5m",
  });
  if (!token) throw new CustomError(500, "Error generate reset-link email.");
  const resetLink = `http://${process.env.DB_HOST}:${process.env.SERVER_PORT}/user/reset-password/${token}`;
  console.log("resetLink: ", resetLink);
  return resetLink;
};

export const saveNewUserPassword = async (newPassword: string, reqEmail: string) => {
  const affectedRow = await userSequelize.update(
    { password: newPassword },
    {
      where: { email: reqEmail },
    }
  );
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error save new password.");
};
