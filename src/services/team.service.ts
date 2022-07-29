import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);
const teamSequelize = sequelize.getRepository(Team);

/**
 * Find all teams in the database.
 * @returns Promise array of objects with `id`, `team_name`.
 * @throws `CustomError` if teams not found in the database(`teams.length` equal to zero(`0`)).
 */
export const getInfoAllTeams = async () => {
  const teams = await teamSequelize.findAll({
    attributes: ["id", "team_name"],
  });
  if (teams.length === 0) throw new CustomError(500, "Teams not found.");
  return teams;
};

/**
 * Find one team in the database.
 * @param teamId Team ID.
 * @returns Promise object with team: `id`, `team_name`. And users that are in the team: `id`, `first_name`, `second_name`, `email`, `team_id`.
 * @throws `CustomError` if `teamId` not found in the database.
 */
export const getInfoTeamById = async (teamId: string) => {
  const team = await teamSequelize.findOne({
    where: { id: teamId },
    attributes: ["id", "team_name"],
    include: [{ model: userSequelize, attributes: ["id", "first_name", "second_name", "email", "team_id"] }],
  });
  if (!team) throw new CustomError(404, "Team not found.");
  return team;
};

/**
 * Adding a user to the team.
 * @param teamName Team name.
 * @param userId User id.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 * @throws `CustomError` if `teamName` not found in the database, or `affectedRow` is not equal to one(`1`).
 */
export const addPlayerInTeam = async (teamName: string, userId: string) => {
  const team = await teamSequelize.findOne({
    where: {
      team_name: teamName,
    },
  });
  if (!team) throw new CustomError(404, "Team not found.");
  const affectedRow = await userSequelize.update(
    { team_id: team.id },
    {
      where: { id: userId },
    }
  );
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error adding a player to the team.");
};

/**
 * Deleting a user from the team.
 * @param userId User id.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 * @throws `CustomError` if `userId` not found in the database, or `affectedRow` is not equal to one(`1`).
 */
export const deletePlayerFromTeamById = async (userId: string) => {
  const affectedRow = await userSequelize.update(
    { team_id: null },
    {
      where: { id: userId },
    }
  );
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error removing a player from the team.");
};
