import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);

export const findUserEmail = async (reqEmail: string) => {
  const emailFind = await userSequelize.findOne({
    where: { email: reqEmail },
    attributes: ["email", "id"],
  });
  if (emailFind) {
    const email = emailFind.email;
    const id = emailFind.id;
    return { email, id };
  }
  throw new CustomError(401, `User with email ${reqEmail} is not found.`);
};
