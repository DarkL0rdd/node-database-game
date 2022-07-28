import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { hashUserPassword } from "./password.service";
import { CustomError } from "./error.service";
import { HashRound, UserRole, UserStatus } from "./all.enums";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);

interface UserInfo {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
}

/**
 * Create new user in the database.
 * @param userInfoObj User's data with `first_name`, `second_name`, `email`, `password`.
 * @returns Promise with new `User`.
 * @throws `CustomError` if `rolePlayer` not found in database or required fields are empty.
 */
export const createUser = async (userInfoObj: UserInfo) => {
  const rolePlayer = await roleSequelize.findOne({ where: { role_name: UserRole.Player } });
  if (!rolePlayer) throw new CustomError(500, "User registration error.");
  const hashPassword = await hashUserPassword(userInfoObj.password, HashRound.EightRound);
  return await userSequelize.create({
    first_name: userInfoObj.first_name,
    role_id: rolePlayer.id,
    second_name: userInfoObj.second_name,
    email: userInfoObj.email,
    password: hashPassword,
    status: UserStatus.Active,
  });
};

/**
 * Find user's personal data in the database.
 * @param userEmail User's email.
 * @returns Promise object with user's data.
 * @throws `CustomError` if user not found in the database.
 */
export const getInfoUserProfile = async (userEmail: string) => {
  const userInfo = await userSequelize.findOne({
    where: { email: userEmail },
    attributes: ["first_name", "second_name", "email"],
    include: [{ model: roleSequelize, attributes: ["role_name"] }],
  });
  if (!userInfo) throw new CustomError(404, "User not found.");
  return userInfo;
};

/**
 * Updates user's personal data in the database.
 * @param userEmail User's email.
 * @param newUserInfoObj New user's data with `first_name`, `second_name`, `email`, `password`.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 */
export const changeInfoUserProfile = async (userEmail: string, newUserInfoObj: UserInfo) => {
  if (!userEmail) throw new CustomError(401, "User email is empty.");
  let userInfoObj: any = {};
  for (const key in newUserInfoObj) {
    if (newUserInfoObj[key as keyof UserInfo]) {
      userInfoObj[key] = newUserInfoObj[key as keyof UserInfo];
    }
  }
  if (userInfoObj.password) {
    const hashPassword = await hashUserPassword(newUserInfoObj.password, 8);
    userInfoObj.password = hashPassword;
  }
  const affectedRow = await userSequelize.update(userInfoObj, { where: { email: userEmail } });
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error change user profile.");
};

/**
 * Find users' personal data in the database by role.
 * @param queryRole User's role.
 * @returns Promise an array of object with users' data.
 * @throws `CustomError` if users not found in the database(`users.length` is equal to zero(`0`)).
 */
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

/**
 * Find user's personal data in the database by role and id.
 * @param queryRole User's role.
 * @param userId User's id.
 * @returns Promise object with user's data.
 * @throws `CustomError` if user not found in the database.
 */
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

/**
 * Updates user's status to `Blocked` in the database.
 * @param userId User's id.
 * @param msgReason Reason for blocking user.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 * @throws `CustomError` if `userId` not found in the database.
 */
export const blockUserById = async (userId: string, msgReason?: string) => {
  const affectedRow = await userSequelize.update({ status: UserStatus.Blocked, reason: msgReason }, { where: { id: userId } });
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error block user.");
};

/**
 * Updates user's status to `Active` in the database.
 * @param userId User's id.
 * @param msgReason Reason for unblocking user.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 * @throws `CustomError` if `userId` not found in the database.
 */
export const unblockUserById = async (userId: string, msgReason?: string) => {
  const affectedRow = await userSequelize.update({ status: UserStatus.Active, reason: msgReason }, { where: { id: userId } });
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error unblock user.");
};
