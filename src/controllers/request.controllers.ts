import { Request, Response } from "express";
import {
  answerRequest,
  cancelRequestById,
  createUserRequest,
  getInfoAllRequests,
  getInfoOwnRequestById,
  getInfoOwnRequests,
  getInfoRequestById,
} from "../services/requests.service";

export const createNewRequest = async (req: Request, res: Response) => {
  try {
    await createUserRequest(req.user.reqEmail, req.body.request_type, req.body.description, req.body.team_name);
    res.status(200).json({ Message: "Successful create new request." });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const showAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await getInfoAllRequests();
    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const showRequestById = async (req: Request, res: Response) => {
  try {
    const request = await getInfoRequestById(req.params.id);
    return res.status(200).json(request);
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const showOwnRequests = async (req: Request, res: Response) => {
  try {
    const requests = await getInfoOwnRequests(req.user.reqEmail);
    res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const showOwnRequestById = async (req: Request, res: Response) => {
  try {
    const request = await getInfoOwnRequestById(req.params.id, req.user.reqEmail);
    return res.json(request);
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const cancelRequest = async (req: Request, res: Response) => {
  try {
    await cancelRequestById(req.params.id);
    res.status(200).json({ Message: "Successful cancel request." });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const answerToRequest = async (req: Request, res: Response) => {
  try {
    await answerRequest(req.params.id, req.body.answer, req.body.team_name);
    return res.status(200).json({ Message: "Successful answer to request." });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};
