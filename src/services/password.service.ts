import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);

/**
 * Hashes user's password.
 * @param reqPassword User's password.
 * @param salRounds Number of rounds for bcrypt.
 * @returns Promise string hashed password of user.
 * @throws `CustomError` if password hashing error.
 */
export const hashUserPassword = async (reqPassword: string, salRounds: number) => {
  if (reqPassword) {
    return bcrypt.hashSync(reqPassword, salRounds);
  }
  throw new CustomError(500, "Error password.");
};

/**
 * Compares user's password in the database.
 * @param reqEmail User's email.
 * @param reqPassword User's password.
 * @returns Promise boolean `true` if password is correct.
 * @throws `CustomError` if `reqEmail` not found in the database or error comparing password.
 */
export const compareUserPassword = async (reqEmail: string, reqPassword: string) => {
  const passwordFind = await userSequelize.findOne({
    where: { email: reqEmail },
    attributes: ["password"],
  });
  if (!passwordFind) throw new CustomError(401, "Email is incorrect.");
  const hashCompare: boolean = bcrypt.compareSync(reqPassword, passwordFind.password);
  if (!hashCompare) throw new CustomError(403, "Password is incorrect.");
  return hashCompare;
};

/**
 * Generates reset-link.
 * @param userEmail User's email.
 * @returns Promise string reset-link.
 * @throws `CustomError` if JWT token generation error.
 */
export const generateLinkEmail = async (userEmail: string) => {
  const token = jwt.sign({ userEmail }, `${process.env.ACCESS_SECRET_KEY}`, {
    expiresIn: "5m",
  });
  if (!token) throw new CustomError(500, "Error generate reset-link email.");
  const resetLink = `http://${process.env.DB_HOST}:${process.env.SERVER_PORT}/user/reset-password/${token}`;
  console.log("resetLink: ", resetLink);
  return resetLink;
};

/**
 * Save new user's password in the database.
 * @param newPassword New user's password.
 * @param reqEmail User's email.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 * @throws `CustomError` if `reqEmail` not found in the database, or `affectedRow` is not equal to one(`1`).
 */
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
