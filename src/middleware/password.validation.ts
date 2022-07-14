import { Request, Response, NextFunction } from "express";
import { CustomError } from "../services/error.service";

export const validateUserPassword = () => {
  const funct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/;
      /*
          (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character;
          (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character;
          (?=.*[0-9])	The string must contain at least 1 numeric character;
          (?=.*[!@#$%^&*])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict;
          (?=.{4,})	The string must be 4 characters or longer;
        */
      if (req.body.password.match(reg)) {
        res.locals.password = req.body.password;
        next();
      }
      throw new CustomError(404, "Password must match the expression.");
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ Message: err.message });
    }
  };
  return funct;
};
