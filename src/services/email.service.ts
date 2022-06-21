import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);

export const findUserEmail = async (reqEmail: string) => {
  const emailFind = await userSequelize.findOne({
    where: { email: reqEmail },
  });
  if (emailFind) {
    const email = emailFind.email;
    const id = emailFind.id;
    return { email, id };
  }
  throw new CustomError(401, `User with email ${reqEmail} is not found.`);
};

export const compareUserEmail = async (reqNewEmail: string) => {
  const userEmail = await userSequelize.findOne({
    where: { email: reqNewEmail },
  });
  if (userEmail?.email === reqNewEmail) {
    throw new CustomError(409, `User with email ${reqNewEmail} already exist.`);
  } else {
    return userEmail;
  }
};
