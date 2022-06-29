import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { UserRequest } from "../models/userrequest.model";
import { Team } from "../models/team.model";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);
const teamSequelize = sequelize.getRepository(Team);
const requestSequelize = sequelize.getRepository(UserRequest);

export const getInfoAllTeams = async () => {
  const teams = await teamSequelize.findAll({
    attributes: ["id", "team_name"],
  });
  if (!teams) throw new CustomError(500, "Teams not found.");
  return teams;
};

export const getInfoTeamById = async (teamId: string) => {
  const team = await teamSequelize.findOne({
    where: { id: teamId },
    attributes: ["id", "team_name"],
    include: [{ model: userSequelize, attributes: ["id", "first_name", "second_name", "email", "team_id"] }],
  });
  if (!team) throw new CustomError(404, "Team not found.");
  return team;
};

export const deletePlayerFromTeamById = async (userId: string, teamId: string) => {
  const user = await userSequelize.findOne({
    where: { id: userId },
    attributes: ["id", "team_id"],
    include: [{ model: teamSequelize, where: { id: teamId } }],
  });

  console.log(user?.toJSON());

  if (!user) throw new CustomError(404, "User not found.");
  return await user.update({ team_id: 0 }); //! undefined
};
