import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { removeToken } from "../services/jwt.service";
import { hashUserPassword } from "./password.service";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);

const enum UserRole {
  admin = "Admin",
  manager = "Manager",
  player = "Player",
}

const enum UserStatus {
  active = "Active",
  blocked = "Blocked",
}

const enum ManagerRequest {}

const enum PlayerRequest {}

const enum StatusRequest {
  approved = "Approved",
  declined = "Declined",
  pending = "Pending",
}

export const createUser = async (reqFirstName: string, reqSecondName: string, reqEmail: string, reqPassword: string) => {
  try {
    const rolePlayer = await roleSequelize.findOne({ where: { role_name: UserRole.player } });
    if (!rolePlayer) return;
    return await userSequelize.create({
      first_name: reqFirstName,
      role_id: rolePlayer.id,
      second_name: reqSecondName,
      email: reqEmail,
      password: reqPassword,
      status: UserStatus.active,
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
  } catch (err) {
    console.log(err);
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
  } catch (err) {
    console.log(err);
  }
};

export const getInfoManagers = async () => {
  try {
    return await userSequelize.findAll({
      //attributes: ["first_name", "second_name", "email"],
      include: [{ model: roleSequelize, /*attributes: ["role_name"],*/ where: { role_name: UserRole.manager } }],
      attributes: { exclude: ["password", "refresh_token"] },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getInfoManagerById = async (managerId: string) => {
  try {
    return await userSequelize.findOne({
      where: { id: managerId },
      include: [{ model: roleSequelize, where: { role_name: UserRole.manager } }],
      attributes: { exclude: ["password", "refresh_token"] },
    });
  } catch (err) {
    console.log(err);
  }
};

export const changeRolePlayerToManager = async (playerId: string) => {
  try {
    const roleManager = await roleSequelize.findOne({ where: { role_name: UserRole.manager } });
    if (!roleManager) return;
    return await userSequelize.update({ role_id: roleManager.id }, { where: { id: playerId } });
  } catch (err) {
    console.log(err);
  }
};

export const changeRoleManagerToPlayer = async (managerId: string) => {
  try {
    const rolePlayer = await roleSequelize.findOne({ where: { role_name: UserRole.player } });
    if (!rolePlayer) return;
    return await userSequelize.update({ role_id: rolePlayer.id }, { where: { id: managerId } });
  } catch (err) {
    console.log(err);
  }
};

export const blockUser = async (userId: string, msgReason?: string) => {
  try {
    return await userSequelize.update({ status: UserStatus.blocked, reason: msgReason }, { where: { id: userId } });
  } catch (err) {
    console.log(err);
  }
};

export const unblockUser = async (userId: string, msgReason?: string) => {
  try {
    return await userSequelize.update({ status: UserStatus.active, reason: msgReason }, { where: { id: userId } });
  } catch (err) {
    console.log(err);
  }
};

export const getInfoPlayers = async () => {
  try {
    return await userSequelize.findAll({
      include: [{ model: roleSequelize, where: { role_name: UserRole.player } }],
      attributes: { exclude: ["password", "refresh_token"] },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getInfoPlayerById = async (playerId: string) => {
  try {
    return await userSequelize.findOne({
      where: { id: playerId },
      include: [{ model: roleSequelize, where: { role_name: UserRole.player } }],
      attributes: { exclude: ["password", "refresh_token"] },
    });
  } catch (err) {
    console.log(err);
  }
};

//test
export const getInfoAllUsers = async () => {
  try {
    return await userSequelize.findAll({
      include: [{ model: roleSequelize }],
      attributes: { exclude: ["password", "refresh_token"] },
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendRequestAddInTeam = async (playerId: string) => {
  try {
    const player = await getInfoPlayerById(playerId);
    if (!player) return;
    return await userSequelize.update(
      {
        status: StatusRequest.pending,
        reason: `#${player.id} ${player.first_name} ${player.second_name} wants to join the team`, //name team + id team
      },
      { where: { id: playerId } }

      // {
      //   where: { id: managerId },
      //   include: [{ model: userSequelize, where: { id: playerId } }],
      //   attributes: { exclude: ["password", "refresh_token"] },
      // }
    );
  } catch (err) {
    console.log(err);
  }
};
