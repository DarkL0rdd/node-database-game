import { Request, Response } from "express";
import { findUserEmail, compareUserEmail } from "../services/email.service";
import {
  hashUserPassword,
  compareUserPassword,
} from "../services/password.service";
import { generateToken, saveToken, refresh } from "../services/jwt.service";
import { createUser, logout } from "../services/user.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userEmail = await compareUserEmail(req.body.email);
    if (!userEmail)
      return res
        .status(500)
        .send(`User with email ${req.body.email} already exist.`);
    const hashPassword = await hashUserPassword(req.body.password, 8);
    if (hashPassword) {
      const user = await createUser(
        req.body.first_name,
        req.body.second_name,
        req.body.email,
        hashPassword
      );
      if (user) return res.status(200).send("Successful registration.");
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
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
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
    const cookieRefreshToken = req.cookies["refresh-token"];
    if (!cookieRefreshToken) return res.send("You are already logged out."); //res.redirect("/login");
    await logout(cookieRefreshToken);
    res.clearCookie("refresh-token");
    res.send("You are logged out.");
  } catch (err) {
    console.log(err);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const userEmail = await findUserEmail(req.body.email);
    if (!userEmail)
      return res
        .status(400)
        .send(`User with email ${req.body.email} is not found.`);

    const cookieRefreshToken = req.cookies["refresh-token"];
    const newRefreshToken = await refresh(cookieRefreshToken);
    if (!newRefreshToken) return res.send("You can't refresh");
    const tokens = generateToken(req.body.email, "30m", "30d");
    if (tokens) {
      await saveToken(userEmail.id, tokens.refreshToken);
      res.cookie("refresh-token", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send("Successful refresh token");
    }
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const email = req.body.email;
  console.log(email);
  //find user
};

export const resetPassword = async (req: Request, res: Response) => {};

/*validation:
name: number, symbols)_$
*/
