import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { removeToken } from "../services/jwt.service";

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
      refresh_token: "",
    }));
  } catch (err) {
    console.log(err);
    return (user = undefined);
  }
};

export const logout = async (refreshToken: string) => {
  try {
    await removeToken(refreshToken);
  } catch (err) {
    console.log(err);
  }
};

export const getAllUsers = async () => {
  let users: User[] | undefined = undefined;
  try {
    return (users = await userSequelize.findAll({
      attributes: {
        exclude: ["password", "refresh_token", "createdAt", "updatedAt"],
      },
    }));
  } catch (err) {
    console.log(err);
    return (users = undefined);
  }
};
