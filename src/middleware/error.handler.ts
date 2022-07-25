import { Request, Response, NextFunction } from "express";
import { CustomError } from "../services/error.service";

/**
 * Global error-handler middleware.
 * @param err Error object.
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next function.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("Error-handler: ", err);
  let customError = err;
  if (!(err instanceof CustomError)) {
    customError = new CustomError(500, "Server Error");
  }
  res.status((customError as CustomError).status).json({ Message: customError.message });
};
