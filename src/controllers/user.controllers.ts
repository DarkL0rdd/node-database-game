import { Request, Response } from "express";
import { findUserEmail, compareUserEmail } from "../services/email.service";
import {
  hashUserPassword,
  compareUserPassword,
} from "../services/password.service";
import { generateToken, saveToken } from "../services/jwt.service";
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
    const cookieRefreshTpken = req.cookies["refresh-token"];
    if (!cookieRefreshTpken) return res.send("You are already logged out."); //res.redirect("/login");
    await logout(cookieRefreshTpken);
    res.clearCookie("refresh-token");
    res.send("You are logged out.");
  } catch (err) {
    console.log(err);
  }
};

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
