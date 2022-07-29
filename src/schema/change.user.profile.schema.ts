import { body } from "express-validator";
import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { CustomError } from "../services/error.service";

const userSequelize = sequelize.getRepository(User);

export const changeUserProfileSchema = [
  //first_name
  body("first_name").optional({ checkFalsy: true }).not().isEmpty().withMessage("First name is required."),
  body("first_name").optional({ checkFalsy: true }).exists({ checkFalsy: true }).withMessage(`First name is required.`),
  body("first_name").optional({ checkFalsy: true }).isString().withMessage("First name type error."),
  body("first_name")
    .optional({ checkFalsy: true })
    .isLength({ min: 1, max: 50 })
    .withMessage("First name cannot be shorter than 1 character and longer than 50 characters."),

  //second_name
  body("second_name").optional({ checkFalsy: true }).exists({ checkFalsy: true }).withMessage("Second name is required."),
  body("second_name").optional({ checkFalsy: true }).isString().withMessage("Second name type error."),
  body("second_name")
    .optional({ checkFalsy: true })
    .isLength({ min: 1, max: 50 })
    .withMessage("Second name cannot be shorter than 1 character and longer than 50 characters."),

  //email
  body("email").optional({ checkFalsy: true }).isEmail().normalizeEmail().withMessage("Email is not valid."),
  body("email").optional({ checkFalsy: true }).isString().withMessage("Email type error."),
  body("email")
    .optional({ checkFalsy: true })
    .custom(async (value) => {
      const userEmail = await userSequelize.findOne({
        where: { email: value },
        attributes: ["email"],
      });
      if (userEmail) throw new CustomError(409, `User with email ${value} already exist.`);
    }),
  body("email")
    .optional({ checkFalsy: true })
    .isLength({ min: 1, max: 254 })
    .withMessage("Email cannot be shorter than 1 character and longer than 254 characters."),

  //password
  body("password").optional({ checkFalsy: true }).isString().withMessage("Password type error."),
  body("password")
    .optional({ checkFalsy: true })
    .isLength({ min: 8, max: 100 })
    .withMessage("Password cannot be shorter than 8 characters and longer than 100 characters."),
];
