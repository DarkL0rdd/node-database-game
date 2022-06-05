import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSequelize = sequelize.getRepository(User);

export const hashUserPassword = async (
  reqPassword: string,
  salRounds: number
) => {
  try {
    if (reqPassword) {
      return await bcrypt.hashSync(reqPassword, salRounds);
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

const findUserPassword = async (reqEmail: string) => {
  try {
    const emailFind = await userSequelize.findOne({
      where: { email: reqEmail },
    });
    if (emailFind?.email) {
      return emailFind.password;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

export const compareUserPassword = async (
  reqEmail: string,
  reqPassword: string
) => {
  try {
    const dbUserPassword = await findUserPassword(reqEmail);
    if (dbUserPassword) {
      const hashCompare: boolean = await bcrypt.compareSync(
        reqPassword,
        dbUserPassword
      );
      return hashCompare;
    }
  } catch (err) {
    console.log(err);
  }
};

export const generateLinkEmail = async (userEmail: string) => {
  try {
    const token = jwt.sign({ userEmail }, `${process.env.ACCESS_SECRET_KEY}`, {
      expiresIn: "5m",
    });
    const resetLink = `http://${process.env.DB_HOST}:${process.env.SERVER_PORT}/user/reset-password/${token}`;
    return resetLink;
  } catch (err) {
    console.log(err);
  }
};

export const changePassword = async (newUserPassword: string) => {
  return await hashUserPassword(newUserPassword, 8);
};

export const saveNewUserPassword = async (password: string) => {
  try {
    return await userSequelize.update(
      { password: password },
      {
        where: { email: process.env.EMAIL_RESET_PASSWORD },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
