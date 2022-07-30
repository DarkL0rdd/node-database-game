import { body } from "express-validator";
import { RequestType } from "../services/all.enums";

export const userRequestSchema = [
  //request_type
  body("request_type").not().isEmpty().withMessage("Request type is required."),
  body("request_type").isString().withMessage("Request type is not valid."),
  body("request_type").isIn(Object.values(RequestType)).withMessage("Request type is not valid."),

  //description
  body("description").optional({ checkFalsy: false }).not().isEmpty().withMessage("Description is required."),
  body("description").optional({ checkFalsy: false }).isString().withMessage("Description type error."),
  body("description")
    .optional({ checkFalsy: false })
    .isLength({ max: 254 })
    .withMessage("Description can contain up to 254 characters."),

  //team_name
  body("team_name").optional({ checkFalsy: false }).not().isEmpty().withMessage("Team name is required."),
  body("team_name").optional({ checkFalsy: false }).isString().withMessage("Team name type error."),
  body("team_name")
    .optional({ checkFalsy: false })
    .isLength({ max: 100 })
    .withMessage("Team name can contain up to 100 characters."),
];
