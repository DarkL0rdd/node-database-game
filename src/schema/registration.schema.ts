import { body } from "express-validator";
import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { CustomError } from "../services/error.service";

const userSequelize = sequelize.getRepository(User);

export const registrationSchema = [
  //user first_name
  body("first_name").not().isEmpty().withMessage("First name is required."),
  body("first_name").exists({ checkFalsy: true }).withMessage(`First name is required.`),
  body("first_name").isString().withMessage("First name type error."),
  body("first_name")
    .isLength({ min: 1, max: 50 })
    .withMessage("First name cannot be shorter than 1 character and longer than 50 characters."),

  //user second_name
  body("second_name").not().isEmpty().withMessage("Second name is required."),
  body("second_name").exists({ checkFalsy: true }).withMessage("Second name is required."),
  body("second_name").isString().withMessage("Second name type error."),
  body("second_name")
    .isLength({ min: 1, max: 50 })
    .withMessage("Second name cannot be shorter than 1 character and longer than 50 characters."),

  //user email
  body("email").not().isEmpty().withMessage("Email is required."),
  body("email").isEmail().normalizeEmail().withMessage("Email is not valid."),
  body("email").isString().withMessage("Email type error."),
  body("email").custom(async (value) => {
    const userEmail = await userSequelize.findOne({
      where: { email: value },
      attributes: ["email"],
    });
    if (userEmail) throw new CustomError(409, `User with email ${value} already exist.`);
  }),
  body("email")
    .isLength({ min: 1, max: 254 })
    .withMessage("Email cannot be shorter than 1 character and longer than 254 characters."),

  //user password
  body("password").not().isEmpty().withMessage("Password is required."),
  body("password").isString().withMessage("Password type error."),
  body("password")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password cannot be shorter than 8 characters and longer than 100 characters."),
];
