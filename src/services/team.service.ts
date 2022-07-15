import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);
const teamSequelize = sequelize.getRepository(Team);

export const getInfoAllTeams = async () => {
  const teams = await teamSequelize.findAll({
    attributes: ["id", "team_name"],
  });
  if (teams.length === 0) throw new CustomError(500, "Teams not found.");
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

export const deletePlayerFromTeamById = async (userId: string) => {
  const affectedRow = await userSequelize.update(
    { team_id: null },
    {
      where: { id: userId },
    }
  );
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error delete player from team.");
};
