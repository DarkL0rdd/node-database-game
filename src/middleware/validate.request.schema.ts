import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../services/error.service";

/**
 * Validates request body.
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next function.
 */
export const validateRequestSchema = (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    res.locals.password = req.body.password;
    next();
  } catch (err) {
    next(err);
  }
};
