import { Request, Response } from "express";
import { sequelize } from "../sequelize";
import { User } from "../models/user_model";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userSequelize = sequelize.getRepository(User);

    const emailFind = await userSequelize.findOne({
      where: { email: req.body.email },
    });

    if (emailFind?.email === req.body.email) {
      res.send("Email already exist.");
    } else {
      const hashPassword: string = await bcrypt.hashSync(req.body.password, 8);

      const userCreate: User = await userSequelize.create({
        first_name: req.body.first_name,
        second_name: req.body.second_name,
        email: req.body.email,
        password: hashPassword,
      });

      const token: string = await generateAccessToken(
        userCreate.id,
        req.body.email
      );
      res.cookie("access-token", token, { httpOnly: true, maxAge: 4000 });
      res.status(200).send("Successful registration.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

export const loginUser = async (req: Request, res: Response) => {
  //аутентификация + авторизация
  try {
    const addUserSequelize = sequelize.getRepository(User);
    const userFind = await User.findOne({ where: { email: req.body.email } });
    if (!userFind) {
      res.status(400).send(`User with email ${req.body.email} is not found.`);
    } else {
      try {
        if (await bcrypt.compareSync(req.body.password, userFind.password)) {
          const token = await generateAccessToken(userFind.id, req.body.email);
          res.send(token);
        } else {
          res.send("Wrong password.");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

const generateAccessToken = (id: number, email: string): string => {
  const payload = {
    id,
    email,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "10m" });
};
