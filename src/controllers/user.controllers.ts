import { Request, Response } from "express";
import { findUserEmail, compareUserEmail } from "../services/email.service";
import { hashUserPassword, compareUserPassword, generateLinkEmail, saveNewUserPassword } from "../services/password.service";
import {
  generateAccessToken,
  generateRefreshToken,
  removeRefreshToken,
  saveToken,
  verifyAccessToken,
} from "../services/jwt.service";
import {
  createUser,
  getInfoUserProfile,
  changeInfoUserProfile,
  getInfoAllUsersByRole,
  getInfoOneUserByRoleAndId,
  blockUserById,
  unblockUserById,
} from "../services/user.service";
import jwt from "jsonwebtoken";

export const registrationNewUser = async (req: Request, res: Response) => {
  try {
    await compareUserEmail(req.body.email);
    const newUser = await createUser(req.body.first_name, req.body.second_name, req.body.email, req.body.password);
    if (newUser) res.status(200).json({ Message: "Successful registration." });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  //автентифікація + авторизація
  try {
    const userEmail = await findUserEmail(req.body.email);
    await compareUserPassword(req.body.email, req.body.password);
    const accessToken = await generateAccessToken(req.body.email, "1s"); //! час життя токену
    const refreshToken = await generateRefreshToken(req.body.email, "30d");
    if (accessToken && refreshToken) {
      await saveToken(userEmail.id, refreshToken);
      res.cookie("refresh-token", refreshToken, {
        maxAge: 24 * 60 * 60 * 30,
        httpOnly: true,
      });
      res.status(200).json({ Message: "Successful login.", "Access Token": accessToken, "Refresh Token": refreshToken });
    }
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization && !req.cookies["refresh-token"])
      return res.status(200).send({ Message: "You are already logged out." });
    await removeRefreshToken(req.cookies["refresh-token"]);
    res.clearCookie("refresh-token");
    res.status(200).json({ Message: "You are logged out." });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const userEmail = await findUserEmail(req.body.email);
    const resetPasswordLink = await generateLinkEmail(userEmail.email);
    res.status(200).json({ Message: "Link has been sent to email.", "Link from email": resetPasswordLink });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const userPayloadFromLink = await verifyAccessToken(req.params.link);
    const userEmailFromLink = JSON.parse(JSON.stringify(userPayloadFromLink));
    const userEmail = await findUserEmail(userEmailFromLink.userEmail);
    const hashPassword = await hashUserPassword(req.body.password, 8);
    const newUserPassword = await saveNewUserPassword(hashPassword, userEmail.email);
    console.log(newUserPassword);
    if (newUserPassword) return res.status(200).json({ Message: "Successful reset password." });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const generateNewTokens = async (req: Request, res: Response) => {
  try {
    console.log("You are in newTokens");
    const refreshTokenCookie = req.cookies["refresh-token"];
    const userPayload = jwt.decode(refreshTokenCookie);
    const getUserPayload = JSON.parse(JSON.stringify(userPayload));
    const accessToken = await generateAccessToken(getUserPayload.reqEmail, "30m");
    const refreshToken = await generateRefreshToken(getUserPayload.reqEmail, "30d");
    res.cookie("refresh-token", refreshToken, {
      maxAge: 24 * 60 * 60 * 30,
      httpOnly: true,
    });
    res.status(200).json({ "New Access Token": accessToken, "New Refresh Token": refreshToken }); //!add redirect to previous page
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const showInfoUserProfile = async (req: Request, res: Response) => {
  try {
    const oneUser = await getInfoUserProfile(req.user.reqEmail);
    res.json(oneUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: err.message });
  }
};

export const updateInfoUserProfile = async (req: Request, res: Response) => {
  try {
    if (
      await changeInfoUserProfile(req.user.reqEmail, req.body.first_name, req.body.second_name, req.body.email, req.body.password)
    )
      res.status(200).json({ Message: "Successful update info user." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: err.message });
  }
};
