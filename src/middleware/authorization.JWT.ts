import { Request, Response, NextFunction } from "express";
import {
  authenticateAccessToken,
  authenticateRefreshToken,
} from "../services/jwt.service";

export const checkRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader)
      return res.status(401).send("You are not authorized.");
    const token = authorizationHeader.split(" ")[1];
    const userPayload = authenticateAccessToken(token);
    req.user = userPayload;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Error while authenticating access token.");
  }
};
