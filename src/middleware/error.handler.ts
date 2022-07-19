import { Request, Response, NextFunction } from "express";
import { CustomError } from "../services/error.service";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("Error-handler: ", err);
  let customError = err;
  if (!(err instanceof CustomError)) {
    customError = new CustomError(500, "Server Error");
  }
  res.status((customError as CustomError).status).json({ Message: customError.message });
};
