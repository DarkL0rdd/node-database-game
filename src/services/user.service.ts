import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { removeToken } from "../services/jwt.service";
import { hashUserPassword } from "./password.service";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);

export const createUser = async (reqFirstName: string, reqSecondName: string, reqEmail: string, reqPassword: string) => {
  try {
    const rolePlayer = await roleSequelize.findOne({ where: { role_name: "Player" } });
    if (!rolePlayer) return;
    return await userSequelize.create({
      first_name: reqFirstName,
      role_id: rolePlayer.id,
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

export const getInfoUser = async (userEmail: string) => {
  try {
    return await userSequelize.findOne({
      where: { email: userEmail },
      attributes: ["first_name", "second_name", "email"],
      include: [{ model: roleSequelize, attributes: ["role_name"] }],
    });
  } catch (error) {
    console.log(error);
  }
};

export const changeInfoUser = async (
  userEmail: string,
  newFirstName: string,
  newSecondName: string,
  newUserEmail: string,
  newPassword: string
) => {
  try {
    const user = await getInfoUser(userEmail);
    if (!user) return;
    if (!newFirstName) newFirstName = user.first_name;
    if (!newSecondName) newSecondName = user.second_name;
    if (!newUserEmail) newUserEmail = user.email;
    if (!newPassword) newPassword = user.password;
    const hashPassword = await hashUserPassword(newPassword, 8);
    return await userSequelize.update(
      {
        first_name: newFirstName,
        second_name: newSecondName,
        email: newUserEmail,
        password: hashPassword,
      },
      { where: { email: userEmail } }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getInfoManager = async () => {
  try {
    return await userSequelize.findAll({
      //attributes: ["first_name", "second_name", "email"],
      include: [{ model: roleSequelize, /*attributes: ["role_name"],*/ where: { role_name: "Manager" } }],
      attributes: { exclude: ["password", "refresh_token"] },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getInfoManagerById = async (managerId: string) => {
  try {
    return await userSequelize.findOne({
      where: { id: managerId },
      include: [{ model: roleSequelize, where: { role_name: "Manager" } }],
      attributes: { exclude: ["password", "refresh_token"] },
    });
  } catch (error) {
    console.log(error);
  }
};

//test
export const getAllUsers = async () => {
  try {
    return await userSequelize.findAll({
      include: ["role"],
    });
  } catch (err) {
    console.log(err);
  }
};
