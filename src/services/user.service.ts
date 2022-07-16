import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { hashUserPassword } from "./password.service";
import { CustomError } from "./error.service";
import { HashRound, UserRole, UserStatus } from "./all.enums";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);

export const createUser = async (reqFirstName: string, reqSecondName: string, reqEmail: string, reqPassword: string) => {
  if (!reqFirstName || !reqSecondName || !reqEmail || !reqPassword) throw new CustomError(400, "Required fields are empty.");
  const rolePlayer = await roleSequelize.findOne({ where: { role_name: UserRole.Player } });
  if (!rolePlayer) throw new CustomError(500, "User registration error.");
  const hashPassword = await hashUserPassword(reqPassword, HashRound.EightRound);
  return await userSequelize.create({
    first_name: reqFirstName,
    role_id: rolePlayer.id,
    second_name: reqSecondName,
    email: reqEmail,
    password: hashPassword,
    status: UserStatus.Active,
  });
};

export const getInfoUserProfile = async (userEmail: string) => {
  const userInfo = await userSequelize.findOne({
    where: { email: userEmail },
    attributes: ["first_name", "second_name", "email"],
    include: [{ model: roleSequelize, attributes: ["role_name"] }],
  });
  if (!userInfo) throw new CustomError(404, "User not found.");
  return userInfo;
};

export const changeInfoUserProfile = async (
  userEmail: string,
  newFirstName: string,
  newSecondName: string,
  newUserEmail: string,
  newPassword: string
) => {
  if (!userEmail) throw new CustomError(500, "User email is empty.");
  const user = await userSequelize.findOne({
    where: { email: userEmail },
  });
  if (!user) throw new Error("User not found.");
  if (!newFirstName) newFirstName = user.first_name;
  if (!newSecondName) newSecondName = user.second_name;
  if (!newUserEmail) newUserEmail = user.email;
  let hashPassword = undefined;
  if (!newPassword) {
    newPassword = user.password;
  } else {
    hashPassword = await hashUserPassword(newPassword, 8);
  }
  const affectedRow = await userSequelize.update(
    {
      first_name: newFirstName,
      second_name: newSecondName,
      email: newUserEmail,
      password: hashPassword,
    },
    { where: { email: userEmail } }
  );
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error change user profile.");
};

export const getInfoAllUsersByRole = async (queryRole: string) => {
  const roleName = queryRole.charAt(0).toUpperCase() + queryRole.slice(1);
  const users = await userSequelize.findAll({
    //attributes: ["first_name", "second_name", "email"],
    include: [{ model: roleSequelize, /*attributes: ["role_name"],*/ where: { role_name: roleName } }],
    attributes: { exclude: ["password", "refresh_token"] },
  });
  if (users.length === 0 || !users) throw new CustomError(500, "Users not found.");
  return users;
};

export const getInfoOneUserByRoleAndId = async (queryRole: string, userId: string) => {
  const roleName = queryRole.charAt(0).toUpperCase() + queryRole.slice(1);
  const user = await userSequelize.findOne({
    where: { id: userId },
    include: [{ model: roleSequelize, where: { role_name: roleName } }],
    attributes: { exclude: ["password", "refresh_token"] },
  });
  if (!user) throw new CustomError(500, "User not found.");
  return user;
};

export const blockUserById = async (userId: string, msgReason?: string) => {
  const affectedRow = await userSequelize.update({ status: UserStatus.Blocked, reason: msgReason }, { where: { id: userId } });
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error block user.");
};

export const unblockUserById = async (userId: string, msgReason?: string) => {
  const affectedRow = await userSequelize.update({ status: UserStatus.Active, reason: msgReason }, { where: { id: userId } });
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error unblock user.");
};
