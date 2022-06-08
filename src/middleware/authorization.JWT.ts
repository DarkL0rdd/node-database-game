import { Request, Response, NextFunction } from "express";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../services/jwt.service";

export const authenticateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    if (!refreshToken) return res.status(401).send("Unauthorized.");

    const refreshPayload = await verifyRefreshToken(refreshToken);
    if (!refreshPayload) return res.status(401).send("Unauthorized.");

    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.status(401).send("Unauthorized.");

    const token = authorizationHeader.split(" ")[1];
    const accessPayload = await verifyAccessToken(token);
    if (!accessPayload) {
      console.log("userPayload", accessPayload);
      console.log("Middleware - userPayload is undefined");
      res.redirect(307, "/user/refresh");
    } else {
      req.user = accessPayload;
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
