import { sequelize } from "../sequelize";
import { User } from "../models/user.model";

const userSequelize = sequelize.getRepository(User);

export const findUserEmail = async (reqEmail: string) => {
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
};
