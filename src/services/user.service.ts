import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { removeToken } from "../services/jwt.service";

const userSequelize = sequelize.getRepository(User);

export const createUser = async (reqFirstName: string, reqSecondName: string, reqEmail: string, reqPassword: string) => {
  try {
    return await userSequelize.create({
      first_name: reqFirstName,
      //role_id: +"", //!
      second_name: reqSecondName,
      email: reqEmail,
      password: reqPassword,
      refresh_token: "",
    });
  } catch (err) {
    console.log(err);
  }
};

export const logout = async (refreshToken: string) => {
  try {
    return await removeToken(refreshToken);
  } catch (err) {
    console.log(err);
  }
};

export const getAllUsers = async () => {
  try {
    return await userSequelize.findAll({
      attributes: {
        exclude: ["password", "refresh_token", "createdAt", "updatedAt"],
      },
      include: ["role"],
    });
  } catch (err) {
    console.log(err);
  }
};
