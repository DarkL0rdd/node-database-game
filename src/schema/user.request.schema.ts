import { body } from "express-validator";
import { RequestType } from "../services/all.enums";

export const userRequestSchema = [
  //request_type
  body("request_type").isString().isIn(Object.values(RequestType)).withMessage("Request type is not valid."),

  //description
  body("description").isString(),
  body("description").isLength({ max: 254 }).withMessage("Description can contain up to 254 characters."),

  //team_name
  body("team_name").isString(),
  body("team_name").isLength({ max: 100 }).withMessage("Team name can contain up to 100 characters."),
];
