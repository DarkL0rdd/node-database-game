import { Request, Response } from "express";
import { findUserEmail, compareUserEmail } from "../services/email.service";
import {
  hashUserPassword,
  compareUserPassword,
  generateLinkEmail,
} from "../services/password.service";
import { generateToken, saveToken } from "../services/jwt.service";
import { createUser, getAllUsers, logout } from "../services/user.service";
import console from "console";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userEmail = await compareUserEmail(req.body.email);
    if (!userEmail)
      return res
        .status(500)
        .send(`User with email ${req.body.email} already exist.`);
    const hashPassword = await hashUserPassword(req.body.password, 8);
    if (hashPassword) {
      const newUser = await createUser(
        req.body.first_name,
        req.body.second_name,
        req.body.email,
        hashPassword
      );
      if (newUser) return res.status(200).send("Successful registration.");
    } else {
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
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

    const tokens = generateToken(req.body.email, "30m", "30d");
    if (tokens) {
      await saveToken(userEmail.id, tokens.refreshToken);
      res.cookie("refresh-token", tokens.refreshToken, {
        maxAge: 24 * 60 * 60 * 30,
        httpOnly: true,
      });
      req.headers.authorization = "Bearer " + tokens.accessToken;

      console.log("Your access-token: " + req.headers.authorization); //!!!!!!!

      res.status(200).send("Successful login.");
    } else {
      res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization && !req.cookies["refresh-token"])
      return res.send("You are already logged out.");
    await logout(req.cookies["refresh-token"]);
    res.clearCookie("refresh-token");
    req.headers.authorization = "";
    res.send("You are logged out.");
  } catch (err) {
    console.log(err);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await getAllUsers();
    return res.json(allUsers);
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const userEmail = await findUserEmail(req.body.email);
    if (!userEmail)
      return res
        .status(400)
        .send(`User with email ${req.body.email} is not found.`);
    const resetPasswordLink = await generateLinkEmail();
    console.log(`Link from email: ${resetPasswordLink}`);
    res.send("Link has been sent to email.");
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    console.log("RESET");
    res.send("S");
  } catch (err) {
    console.log(err);
  }
};
