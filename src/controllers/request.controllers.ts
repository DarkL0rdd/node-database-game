import { NextFunction, Request, Response } from "express";
import {
  answerRequest,
  cancelRequestById,
  createUserRequest,
  getInfoAllRequests,
  getInfoOwnRequestById,
  getInfoOwnRequests,
  getInfoRequestById,
} from "../services/requests.service";

export const createNewRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createUserRequest(req.user.reqEmail, req.body.request_type, req.body.description, req.body.team_name);
    res.status(200).json({ Message: "Successful create new request." });
  } catch (err) {
    next(err);
  }
};

export const showAllRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await getInfoAllRequests();
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

export const showRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await getInfoRequestById(req.params.id);
    return res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};

export const showOwnRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await getInfoOwnRequests(req.user.reqEmail);
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

export const showOwnRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await getInfoOwnRequestById(req.params.id, req.user.reqEmail);
    return res.json(request);
  } catch (err) {
    next(err);
  }
};

export const cancelRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cancelRequestById(req.params.id);
    res.status(200).json({ Message: "Successful cancel request." });
  } catch (err) {
    next(err);
  }
};

export const answerToRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await answerRequest(req.params.id, req.body.answer, req.body.team_name);
    return res.status(200).json({ Message: "Successful answer to request." });
  } catch (err) {
    next(err);
  }
};
