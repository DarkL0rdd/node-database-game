import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);

export const hashUserPassword = async (reqPassword: string, salRounds: number) => {
  if (reqPassword) {
    return await bcrypt.hashSync(reqPassword, salRounds);
  }
  throw new CustomError(404, "Password is empty.");
};

const findUserPassword = async (reqEmail: string) => {
  const emailFind = await userSequelize.findOne({
    where: { email: reqEmail },
  });
  if (!emailFind?.email) {
    throw new CustomError(401, `User with email ${reqEmail} is not found.`);
  } else {
    return emailFind.password;
  }
};

export const compareUserPassword = async (reqEmail: string, reqPassword: string) => {
  const userPasswordFromDb = await findUserPassword(reqEmail);
  let hashCompare: boolean = await bcrypt.compareSync(reqPassword, userPasswordFromDb);
  if (!hashCompare) throw new CustomError(403, "Wrong password.");
};

export const generateLinkEmail = async (userEmail: string) => {
  const token = jwt.sign({ userEmail }, `${process.env.ACCESS_SECRET_KEY}`, {
    expiresIn: "5m",
  });
  if (!token) throw new CustomError(500, "Error generate reset-link email.");
  const resetLink = `http://${process.env.DB_HOST}:${process.env.SERVER_PORT}/user/reset-password/${token}`;
  return resetLink;
};

export const saveNewUserPassword = async (newPassword: string, reqEmail: string) => {
  const savePass = await userSequelize.update(
    { password: newPassword },
    {
      where: { email: reqEmail },
    }
  );
  if (!savePass) throw new CustomError(500, "Error save new password.");
  return savePass;
};
