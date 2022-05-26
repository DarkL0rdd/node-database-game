import { Request, Response } from "express";
import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import { findUserEmail, compareUserEmail } from "../services/email.services";
import {
  hashUserPassword,
  compareUserPassword,
} from "../services/password.services";

import { createUser } from "../services/user.services";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSequelize = sequelize.getRepository(User);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userEmail = await compareUserEmail(req.body.email);
    if (!userEmail) res.status(500).send();
    const hashPassword = await hashUserPassword(req.body.password, 8);
    if (hashPassword) {
      const user = await createUser(
        req.body.first_name,
        req.body.second_name,
        req.body.email,
        hashPassword
      );
      if (user) res.status(200).send("Successful registration.");
    } else {
      res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }

  /*try {
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

      res.status(200).send("Successful registration.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }*/
};

export const loginUser = async (req: Request, res: Response) => {
  //аутентификация + авторизация
  try {
    const userEmail = await findUserEmail(req.body.email);
    if (!userEmail)
      return res
        .status(400)
        .send(`User with email ${req.body.email} is not found.`);
    const hashCompare = await compareUserPassword(
      req.body.email,
      req.body.password
    );
    if (!hashCompare) return res.status(400).send(`Wrong password.`);
    res.status(200).send("Successful login.");
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }

  /*try {
    const userFind = await userSequelize.findOne({
      where: { email: req.body.email },
    });

    if (!userFind) {
      res.status(400).send(`User with email ${req.body.email} is not found.`);
    } else {
      try {
        if (await bcrypt.compareSync(req.body.password, userFind.password)) {
          const accessToken: string = await generateAccessToken(
            userFind.id,
            req.body.email,
            "30m"
          );

          const refreshToken: string = await generateAccessToken(
            userFind.id,
            req.body.email
          );

          res.cookie("access-token", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 4000,
          });
          res.status(200).send("Successful login.");
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
  }*/
};

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie("access-token", "", { httpOnly: true, maxAge: 1 });
  console.log("Logout");
  res.redirect("/");
};

/*export const forgotPassword = async (req: Request, res: Response) => {
  const userFind = await userSequelize.findOne({
    where: { email: req.body.email },
  });

  if (!userFind) {
    res.status(400).send(`User with email ${req.body.email} is not found.`);
  } else {
    const token: string = await generateAccessToken(
      userFind.id,
      req.body.email,
      "5m"
    );

    const link = `http://${process.env.DB_HOST}:${process.env.SERVER_PORT}/reset-password/${userFind.id}/${token}`;
    console.log(link);
    res.send("Link has been send to your email.");
  }
};*/

//export const resetPassword = async (req: Request, res: Response) => {};

/*const generateAccessToken = (
  id: number,
  email: string,
  time?: string
): string => {
  const payload = {
    id,
    email,
  };
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
    expiresIn: `${time}`,
  });
};*/

/*interface RequestWithUsers extends Request {
  user: User;
}

const authenticateToken = async (
  req: RequestWithUsers,
  res: Response,
  next: any
) => {
  const bearerToken = req.headers.authorization;
  console.log(bearerToken);
  if (!bearerToken) {
    return res.status(403).send();
  }
  try {
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, "process.env.ACCESS_SECRET_KEY") as User;
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};*/
