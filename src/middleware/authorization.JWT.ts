import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../services/jwt.service";

export const authenticateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const refreshToken = req.cookies["refresh-token"];

    if (!authorizationHeader || !refreshToken) return res.status(401).send("Unauthorized.");

    const token = authorizationHeader.split(" ")[1];
    const accessPayload = await verifyAccessToken(token);

    if (!accessPayload) {
      console.log("MiddlewareJWT - userPayload is: ", accessPayload);
      res.redirect(307, "/user/refresh");
    } else {
      req.user = accessPayload;
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("You are in authenticateRefreshToken");
    const refreshTokenCookie = req.cookies["refresh-token"];
    const refreshPayload = await verifyRefreshToken(refreshTokenCookie);
    if (refreshPayload) next();
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};
