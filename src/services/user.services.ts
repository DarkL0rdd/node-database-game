import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
//import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");

const userSequelize = sequelize.getRepository(User);

export const createUser = async (
  reqFirstName: string,
  reqSecondName: string,
  reqEmail: string,
  reqPassword: string
) => {
  let user: User | undefined = undefined;
  try {
    return (user = await userSequelize.create({
      first_name: reqFirstName,
      second_name: reqSecondName,
      email: reqEmail,
      password: reqPassword,
    }));
  } catch (err) {
    console.log(err);
    return (user = undefined);
  }
};

/*export const findUserEmail = async (reqEmail: string) => {
  try {
    const emailFind = await userSequelize.findOne({
      where: { email: reqEmail },
    });
    if (emailFind?.email) {
      return emailFind.email;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

export const compareUserEmail = async (reqNewEmail: string) => {
  try {
    const userEmail = await findUserEmail(reqNewEmail);
    if (userEmail === reqNewEmail) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};*/

/*export const hashUserPassword = async (
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
};*/
