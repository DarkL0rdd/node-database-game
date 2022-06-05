import { Request, Response, NextFunction } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/jwt.service";

export const authenticateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader)
      return res.status(401).send("You are not authorized.");
    const token = authorizationHeader.split(" ")[1];
    const userPayload = await verifyAccessToken(token);
    if (userPayload === undefined) {
      console.log("Middleware - userPayload is undefined");
      res.redirect(307, "/user/refresh");
    } else {
      req.user = userPayload;
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Error while authenticating access token.");
  }
};

//проверка валиден ли акссес токен - если нет то генерируем новый акссес токен с помощью рефреш токена +
// + при этом проверить валиден ли рефреш токен, чтобы выдать аксесс токен - если рефреш валиден - обновляем акссес токен -
//  если не валиден - выдаем ошибку
