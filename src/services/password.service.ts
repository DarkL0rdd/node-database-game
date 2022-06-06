import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSequelize = sequelize.getRepository(User);

export const hashUserPassword = async (reqPassword: string, salRounds: number) => {
  try {
    if (reqPassword) {
      return await bcrypt.hashSync(reqPassword, salRounds);
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

export const compareUserPassword = async (reqEmail: string, reqPassword: string) => {
  try {
    const userPasswordFromDb = await findUserPassword(reqEmail);
    let hashCompare: boolean = false;
    if (userPasswordFromDb) {
      hashCompare = await bcrypt.compareSync(reqPassword, userPasswordFromDb);
    }
    return hashCompare;
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

export const saveNewUserPassword = async (password: string, reqEmail: string) => {
  try {
    return await userSequelize.update(
      { password: password },
      {
        where: { email: reqEmail },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
