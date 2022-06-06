import { Request, Response } from "express";
import { findUserEmail, compareUserEmail } from "../services/email.service";
import { hashUserPassword, compareUserPassword, generateLinkEmail, saveNewUserPassword } from "../services/password.service";
import {
  generateAccessToken,
  generateRefreshToken,
  saveToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/jwt.service";
import { createUser, getAllUsers, logout } from "../services/user.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userEmail = await compareUserEmail(req.body.email);
    if (userEmail) return res.status(500).send(`User with email ${req.body.email} already exist.`);
    const hashPassword = await hashUserPassword(req.body.password, 8);
    if (hashPassword) {
      const newUser = await createUser(req.body.first_name, req.body.second_name, req.body.email, hashPassword);
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
  //автентифікація + авторизація
  try {
    const userEmail = await findUserEmail(req.body.email);
    if (!userEmail) return res.status(400).send(`User with email ${req.body.email} is not found.`);

    const hashCompare = await compareUserPassword(req.body.email, req.body.password);
    if (!hashCompare) return res.status(400).send(`Wrong password.`);

    //перевірка існування заголовка авторизації
    /*if (
      req.headers.authorization &&
      (await verifyAccessToken(req.headers.authorization.split(" ")[1])) //! час життя токену
    ) {
      return res.status(200).send("You are already logged in.");
    }*/

    /*if (
      (await verifyAccessToken(
        req.headers.authorization?.split(" ")[1] ?? ""
      )) === false
    ) */

    const accessToken = await generateAccessToken(req.body.email, "1s"); //!! час життя токену
    const refreshToken = await generateRefreshToken(req.body.email, "30d");
    if (accessToken && refreshToken) {
      await saveToken(userEmail.id, refreshToken);
      res.cookie("refresh-token", refreshToken, {
        maxAge: 24 * 60 * 60 * 30,
        httpOnly: true,
      });
      res.status(200).send({ Message: "Successful login.", "Access Token": accessToken, "Refresh Token": refreshToken });
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
    //const accessToken = req.headers.authorization.split(" ")[1]; //!! check[1] !!

    //!? що робити, якщо немає кукі

    if (!req.headers.authorization || !req.cookies["refresh-token"]) return res.send("You are already logged out.");
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
    if (!userEmail) return res.status(400).send(`User with email ${req.body.email} is not found.`);
    const resetPasswordLink = await generateLinkEmail(userEmail.email);
    res.send({ Message: "Link has been sent to email.", "Link from email": resetPasswordLink });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const userPayloadFromLink = await verifyAccessToken(req.params.link); //!!дістати почту з посилання
    const userEmailFromLink = JSON.parse(JSON.stringify(userPayloadFromLink));
    const userEmail = await findUserEmail(userEmailFromLink.userEmail);
    if (!userEmail) return res.status(400).send(`User with email ${userEmailFromLink.userEmail} is not found.`);
    const hashPassword = await hashUserPassword(req.body.password, 8);
    if (hashPassword) {
      const newUserPassword = await saveNewUserPassword(hashPassword, userEmail.email);
      if (newUserPassword) return res.status(200).send("Successful reset password.");
    } else {
      return res.status(500).send("Something went wrong.");
    }
  } catch (err) {
    console.log(err);
  }
};

export const newAccessToken = async (req: Request, res: Response) => {
  try {
    console.log("You are in newAccessToken");
    const refreshToken = req.cookies["refresh-token"];
    if (!refreshToken) return res.status(401).send("You are not authorized.");
    const userPayload = await verifyRefreshToken(refreshToken);
    if (!userPayload) return res.status(401).send("You are not authorized.");
    const getUserPayload = JSON.parse(JSON.stringify(userPayload));
    const accessToken = await generateAccessToken(getUserPayload.reqEmail, "30m");
    res.status(200).send({ "New Access Token": accessToken });
  } catch (err) {
    console.log(err);
  }
};
