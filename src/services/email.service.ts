import { sequelize } from "../sequelize";
import { User } from "../models/user.model";

const userSequelize = sequelize.getRepository(User);

export const findUserEmail = async (reqEmail: string) => {
  try {
    const emailFind = await userSequelize.findOne({
      where: { email: reqEmail },
    });
    if (emailFind) {
      const email = emailFind.email;
      const id = emailFind.id;
      return { email, id };
    }
  } catch (err) {
    console.log(err);
  }
};

export const compareUserEmail = async (reqNewEmail: string) => {
  try {
    const userEmail = await findUserEmail(reqNewEmail);
    if (userEmail?.email === reqNewEmail) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
