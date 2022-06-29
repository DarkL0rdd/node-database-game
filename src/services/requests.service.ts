import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { UserRequest } from "../models/userrequest.model";
import { Team } from "../models/team.model";
import { RequestType, RequestStatus, UserRole } from "./all.enums";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);
const roleSequelize = sequelize.getRepository(Role);
const teamSequelize = sequelize.getRepository(Team);
const requestSequelize = sequelize.getRepository(UserRequest);

export const createUserRequest = async (
  playerEmail: string,
  typeRequest: RequestType,
  msgDescription?: string,
  team_name?: string
) => {
  const user = await userSequelize.findOne({
    where: { email: playerEmail },
  });
  if (!user) throw new CustomError(404, "User not found.");
  if (!Object.values(RequestType).includes(typeRequest)) throw new CustomError(404, "This request type not found.");
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
    team_id: team?.id,
    description: msgDescription,
    status: RequestStatus.Pending,
  });
};

export const getInfoAllRequests = async () => {
  const requests = await requestSequelize.findAll();
  if (!requests) throw new CustomError(404, "Requests not found.");
  return requests;
};

export const getInfoRequestById = async (requestId: string) => {
  const request = await requestSequelize.findOne({ where: { id: requestId } });
  if (!request) throw new CustomError(404, "Request not found.");
  return request;
};

export const getInfoOwnRequests = async (requestUserEmail: string) => {
  const user = await userSequelize.findOne({ where: { email: requestUserEmail } });
  if (!user) throw new CustomError(404, "User not found.");
  const requests = await requestSequelize.findAll({ where: { user_id: user.id } });
  if (!requests) throw new CustomError(404, "Requests not found.");
  return requests;
};

export const getInfoOwnRequestById = async (requestId: string, requestUserEmail: string) => {
  const user = await userSequelize.findOne({ where: { email: requestUserEmail } });
  if (!user) throw new CustomError(404, "User not found.");
  const request = await requestSequelize.findOne({ where: { id: requestId, user_id: user.id } });
  if (!request) throw new CustomError(404, "Request not found.");
  return request;
};

export const cancelRequestById = async (requestId: string) => {
  const request = await requestSequelize.findOne({ where: { id: requestId } });
  if (!request) throw new CustomError(404, "Request not found.");
  if (request.status !== RequestStatus.Pending) throw new CustomError(409, "This request is already approved or declined.");
  return await requestSequelize.update({ status: RequestStatus.Declined }, { where: { id: requestId } });
};

const answerBecomeManager = async (answer: string, request: UserRequest) => {
  if (answer === RequestStatus.Approved) {
    const roleManager = await roleSequelize.findOne({
      where: {
        role_name: UserRole.Manager,
      },
    });
    if (!roleManager) throw new CustomError(404, "Role not found.");
    await userSequelize.update({ role_id: roleManager.id }, { where: { id: request.user_id } });
    await requestSequelize.update({ status: RequestStatus.Approved }, { where: { id: request.id } });
  } else if (answer === RequestStatus.Declined) {
    await requestSequelize.update({ status: RequestStatus.Declined }, { where: { id: request.id } });
  } else {
    throw new CustomError(500, "Answer error.");
  }
};

const exitFromTeam = async (answer: string, request: UserRequest) => {
  if (answer === RequestStatus.Approved) {
    await userSequelize.update({ team_id: 0 }, { where: { id: request.user_id } }); //!undefined
    await requestSequelize.update({ status: RequestStatus.Approved }, { where: { id: request.id } });
  } else if (answer === RequestStatus.Declined) {
    await requestSequelize.update({ status: RequestStatus.Declined }, { where: { id: request.id } });
  } else {
    throw new CustomError(500, "Answer error.");
  }
};

const answerJoinToTeam = async (answer: string, request: UserRequest, teamName: string) => {
  if (answer === RequestStatus.Approved) {
    const team = await teamSequelize.findOne({
      where: {
        team_name: teamName,
      },
    });
    if (!team) throw new CustomError(404, "Team not found.");
    await userSequelize.update({ team_id: team.id }, { where: { id: request.user_id } });
    await requestSequelize.update({ status: RequestStatus.Approved }, { where: { id: request.id } });
  } else if (answer === RequestStatus.Declined) {
    await requestSequelize.update({ status: RequestStatus.Declined }, { where: { id: request.id } });
  } else {
    throw new CustomError(500, "Answer error.");
  }
};

const objRequestTypes: any = {
  [RequestType.BecomeManager]: answerBecomeManager,
  [RequestType.ExitFromTeam]: exitFromTeam,
  [RequestType.JoinToTeam]: answerJoinToTeam,
  [RequestType.ChangeTeam]: answerJoinToTeam,
} as const;

// answer: Approved, Declined
export const answerRequest = async (paramsId: string, answer: string, teamName?: string) => {
  const request = await requestSequelize.findOne({ where: { id: paramsId, status: RequestStatus.Pending } });
  if (!request) throw new CustomError(404, "Request not found.");
  for (let key in objRequestTypes) {
    console.log(key);
    if (key === request.request_type) {
      return await objRequestTypes[key](answer, request, teamName);
    }
  }
  throw new CustomError(404, "Request type error.");
};
