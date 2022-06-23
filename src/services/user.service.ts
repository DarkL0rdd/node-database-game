import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { UserRequest } from "../models/userrequest.model";
import { Team } from "../models/team.model";
import { removeRefreshToken } from "../services/jwt.service";
import { hashUserPassword } from "./password.service";
import { CustomError } from "./error.service";
import { HashRound, List, UserRole, UserStatus } from "./all.enums";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);
const teamSequelize = sequelize.getRepository(Team);
const requestSequelize = sequelize.getRepository(UserRequest);

export const createUser = async (reqFirstName: string, reqSecondName: string, reqEmail: string, reqPassword: string) => {
  if (!reqFirstName || !reqSecondName || !reqEmail || !reqPassword) throw new CustomError(400, "Required fields are empty.");
  const rolePlayer = await roleSequelize.findOne({ where: { role_name: UserRole.Player } });
  if (!rolePlayer) throw new CustomError(500, "User registration error.");
  const hashPassword = await hashUserPassword(reqPassword, HashRound.EightRound); //?
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
  return await userSequelize.update(
    {
      first_name: newFirstName,
      second_name: newSecondName,
      email: newUserEmail,
      password: hashPassword,
    },
    { where: { email: userEmail } }
  );
};
