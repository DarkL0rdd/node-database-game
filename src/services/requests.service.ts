import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { UserRequest } from "../models/userrequest.model";
import { Team } from "../models/team.model";
import { RequestType, RequestStatus, UserRole } from "./all.enums";
import { CustomError } from "./error.service";
import { addPlayerInTeam, deletePlayerFromTeamById } from "./team.service";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);
const teamSequelize = sequelize.getRepository(Team);
const requestSequelize = sequelize.getRepository(UserRequest);

/**
 * Create new user's request in the database.
 * @param playerEmail User's email.
 * @param typeRequest Type of request.
 * @param msgDescription Description of request.
 * @param team_name Team name.
 * @returns Promise with new `UserRequest`.
 * @throws `CustomError` if `playerEmail` not found in the database, or `userRequest` is not `undefined`, or `team` not found in the database.
 */
export const createUserRequest = async (
  playerEmail: string,
  typeRequest: RequestType,
  msgDescription?: string | undefined,
  team_name?: string | undefined
) => {
  const user = await userSequelize.findOne({
    where: { email: playerEmail },
  });
  if (!user) throw new CustomError(404, "User not found.");

  const userRequest = await requestSequelize.findOne({
    where: { user_id: user.id, request_type: typeRequest, status: RequestStatus.Pending },
  });
  if (userRequest) throw new CustomError(409, "This request type already exists.");

  let team = undefined;
  if (typeRequest === RequestType.ChangeTeam || typeRequest === RequestType.JoinToTeam) {
    if (!team_name) throw new CustomError(404, "Team not found.");
    team = await teamSequelize.findOne({
      where: {
        team_name: team_name,
      },
    });
    if (!team) throw new CustomError(404, "Team not found.");
  }
  return await requestSequelize.create({
    user_id: user.id,
    request_type: typeRequest,
    team_id: team?.id || undefined,
    description: msgDescription || undefined,
    status: RequestStatus.Pending,
  });
};

/**
 * Finds all user's requests in the database.
 * @returns Promise an array of `UserRequest`.
 * @throws `CustomError` if user's requests not found in the database(`requests.length` is equal to zero(`0`)).
 */
export const getInfoAllRequests = async () => {
  const requests = await requestSequelize.findAll();
  if (requests.length === 0) throw new CustomError(404, "Requests not found.");
  return requests;
};

/**
 * Finds one user's request in the database.
 * @param requestId Id of request.
 * @returns Promise with `UserRequest`.
 * @throws `CustomError` if `requestId` not found in the database(`request` is equal to `undefined`).
 */
export const getInfoRequestById = async (requestId: string) => {
  const request = await requestSequelize.findOne({ where: { id: requestId } });
  if (!request) throw new CustomError(404, "Request not found.");
  return request;
};

/**
 * Finds all user's own requests in the database.
 * @param userEmail User's email.
 * @returns Promise an array of `UserRequest`.
 * @throws `CustomError` if `userEmail` not found in the database, or `user.id` not found in the database(`requests.length` is equal to zero(`0`)).
 */
export const getInfoOwnRequests = async (userEmail: string) => {
  const user = await userSequelize.findOne({ where: { email: userEmail } });
  if (!user) throw new CustomError(404, "User not found.");
  const requests = await requestSequelize.findAll({ where: { user_id: user.id } });
  if (requests.length === 0) throw new CustomError(404, "Requests not found.");
  return requests;
};

/**
 * Finds one user's own request in the database.
 * @param requestId Id of request.
 * @param userEmail User's email.
 * @returns Promise with `UserRequest`.
 * @throws `CustomError` if `userEmail` not found in the database, or `requestId` or `user.id` not found in the database(`request` is equal to `undefined`).
 */
export const getInfoOwnRequestById = async (requestId: string, userEmail: string) => {
  const user = await userSequelize.findOne({ where: { email: userEmail } });
  if (!user) throw new CustomError(404, "User not found.");
  const request = await requestSequelize.findOne({ where: { id: requestId, user_id: user.id } });
  if (!request) throw new CustomError(404, "Request not found.");
  return request;
};

/**
 * Cancels the user's request.
 * @param requestId Id of request.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 * @throws `CustomError` if `requestId` not found in the database, or `request.status` is not equal to `Pending`, or `affectedRows` is equal to zero(`0`).
 */
export const cancelRequestById = async (requestId: string) => {
  const request = await requestSequelize.findOne({ where: { id: requestId } });
  if (!request) throw new CustomError(404, "Request not found.");
  if (request.status !== RequestStatus.Pending) throw new CustomError(409, "This request is already approved or declined.");
  const affectedRow = await requestSequelize.update({ status: RequestStatus.Declined }, { where: { id: requestId } });
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(404, "Error updating request.");
};

/**
 * Approves or declines the user's request to become manager.
 * @param answer Status of request.
 * @param requestId Id of request.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 */
const answerBecomeManager = async (answer: string, requestId: UserRequest) => {
  let affectedRow = undefined;
  if (answer === RequestStatus.Approved) {
    const roleManager = await roleSequelize.findOne({
      where: {
        role_name: UserRole.Manager,
      },
    });
    if (!roleManager) throw new CustomError(404, "Role not found.");
    await userSequelize.update({ role_id: roleManager.id }, { where: { id: requestId.user_id } });
    affectedRow = await requestSequelize.update({ status: RequestStatus.Approved }, { where: { id: requestId.id } });
  } else if (answer === RequestStatus.Declined) {
    affectedRow = await requestSequelize.update({ status: RequestStatus.Declined }, { where: { id: requestId.id } });
  } else {
    throw new CustomError(500, "Answer error.");
  }
};

/**
 * Approves or declines the user's request to exit from the team.
 * @param answer Status of request.
 * @param requestId Id of request.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 */
const answerExitFromTeam = async (answer: string, requestId: UserRequest) => {
  if (answer === RequestStatus.Approved) {
    await deletePlayerFromTeamById(String(requestId.user_id));
    await requestSequelize.update({ status: RequestStatus.Approved }, { where: { id: requestId.id } });
  } else if (answer === RequestStatus.Declined) {
    await requestSequelize.update({ status: RequestStatus.Declined }, { where: { id: requestId.id } });
  } else {
    throw new CustomError(500, "Answer error.");
  }
};

/**
 * Approves or declines the user's request to join to the team.
 * @param answer Status of request.
 * @param requestId Id of request.
 * @param teamName Name of team.
 * @param userId User's id.
 */
const answerJoinToTeam = async (answer: string, requestId: UserRequest, teamName: string, userId?: string) => {
  if (answer === RequestStatus.Approved) {
    if (!userId) throw new CustomError(500, "User not found.");
    await addPlayerInTeam(teamName, userId);
    await requestSequelize.update({ status: RequestStatus.Approved }, { where: { id: requestId.id } });
  } else if (answer === RequestStatus.Declined) {
    await requestSequelize.update({ status: RequestStatus.Declined }, { where: { id: requestId.id } });
  } else {
    throw new CustomError(500, "Answer error.");
  }
};

const objRequestTypes: any = {
  [RequestType.BecomeManager]: answerBecomeManager,
  [RequestType.ExitFromTeam]: answerExitFromTeam,
  [RequestType.JoinToTeam]: answerJoinToTeam,
  [RequestType.ChangeTeam]: answerJoinToTeam,
} as const;

/**
 * Approves or declines the user's request.
 * @param paramsId Id of request.
 * @param answer Status of request(`Approved` or `Declined`).
 * @param teamName Name of team.
 * @param userId User's id.
 */
export const answerRequest = async (paramsId: string, answer: string, teamName?: string, userId?: string) => {
  const request = await requestSequelize.findOne({ where: { id: paramsId, status: RequestStatus.Pending } });
  if (!request) throw new CustomError(404, "Request not found.");
  for (let key in objRequestTypes) {
    if (key === request.request_type) {
      return await objRequestTypes[key](answer, request, teamName, userId);
    }
  }
  throw new CustomError(404, "Request type error.");
};
