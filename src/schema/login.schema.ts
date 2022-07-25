import { body } from "express-validator";
import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { CustomError } from "../services/error.service";
import bcrypt from "bcryptjs";
import { compareUserPassword } from "../services/password.service";

const userSequelize = sequelize.getRepository(User);

export const loginSchema = [
  //user email
  body("email").not().isEmpty().withMessage("Email is required."),
  body("email").isEmail().normalizeEmail().withMessage("Email is not valid."),
  body("email").custom(async (value) => {
    const userEmail = await userSequelize.findOne({
      where: { email: value },
      attributes: ["email"],
    });
    if (!userEmail) throw new CustomError(404, `User with email ${value} does not exist.`);
  }),

  //user password
  body("password").not().isEmpty().withMessage("Password is required."),
  body("password")
    .isLength({ min: 1, max: 100 })
    .withMessage("Password cannot be shorter than 8 characters and longer than 100 characters."),
  body("password").custom(async (value, { req }) => {
    const confirmPassword: boolean = await compareUserPassword(req.body.email, value);
  }),
];
