import { NextFunction, Request, Response } from "express";
import { findUserEmail } from "../services/email.service";
import { hashUserPassword, compareUserPassword, generateLinkEmail, saveNewUserPassword } from "../services/password.service";
import {
  generateAccessToken,
  generateRefreshToken,
  removeRefreshToken,
  saveRefreshTokenInDb,
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

export const registrationNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.password = res.locals.password;
    const newUser = await createUser(req.body.first_name, req.body.second_name, req.body.email, req.body.password);
    if (newUser) res.status(200).json({ Message: "Successful registration." });
  } catch (err) {
    next(err);
    //console.log(err);
    //res.status(err.status).json({ Message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  //автентифікація + авторизація
  try {
    const userEmail = await findUserEmail(req.body.email);
    await compareUserPassword(req.body.email, req.body.password);
    const accessToken = await generateAccessToken(req.body.email, "1s"); //! час життя токену
    const refreshToken = await generateRefreshToken(req.body.email, "30d");
    if (accessToken && refreshToken) {
      await saveRefreshTokenInDb(userEmail.id, refreshToken);
      res.cookie("refresh-token", refreshToken, {
        maxAge: 24 * 60 * 60 * 30,
        httpOnly: true,
      });
      res.status(200).json({ Message: "Successful login.", "Access Token": accessToken, "Refresh Token": refreshToken });
    }
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization && !req.cookies["refresh-token"])
      return res.status(200).send({ Message: "You are already logged out." });
    await removeRefreshToken(req.cookies["refresh-token"]);
    res.clearCookie("refresh-token");
    res.status(200).json({ Message: "You are logged out." });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userEmail = await findUserEmail(req.body.email);
    const resetPasswordLink = await generateLinkEmail(userEmail.email);
    res.status(200).json({ Message: "Link has been sent to email.", "Link from email": resetPasswordLink });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userPayloadFromLink = await verifyAccessToken(req.params.link);
    const userEmailFromLink = JSON.parse(JSON.stringify(userPayloadFromLink));
    const userEmail = await findUserEmail(userEmailFromLink.userEmail);
    const hashPassword = await hashUserPassword(req.body.password, 8);
    await saveNewUserPassword(hashPassword, userEmail.email);
    return res.status(200).json({ Message: "Successful reset password." });
  } catch (err) {
    next(err);
  }
};

export const generateNewTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("You are in generateNewTokens");
    const refreshTokenCookie = req.cookies["refresh-token"];
    const userPayload = jwt.decode(refreshTokenCookie);
    const getUserPayload = JSON.parse(JSON.stringify(userPayload));
    const accessToken = await generateAccessToken(getUserPayload.reqEmail, "30m");
    const refreshToken = await generateRefreshToken(getUserPayload.reqEmail, "30d");
    if (accessToken && refreshToken) {
      const userEmail = await findUserEmail(getUserPayload.reqEmail);
      await saveRefreshTokenInDb(userEmail.id, refreshToken);
      res.cookie("refresh-token", refreshToken, {
        maxAge: 24 * 60 * 60 * 30,
        httpOnly: true,
      });
      res.status(200).json({ "New Access Token": accessToken, "New Refresh Token": refreshToken }); //!add redirect to previous page
    }
  } catch (err) {
    next(err);
  }
};

export const showInfoUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oneUser = await getInfoUserProfile(req.user.reqEmail);
    res.json(oneUser);
  } catch (err) {
    next(err);
  }
};

export const updateInfoUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await changeInfoUserProfile(req.user.reqEmail, req.body.first_name, req.body.second_name, req.body.email, req.body.password);
    res.status(200).json({ Message: "Successful update info user." });
  } catch (err) {
    next(err);
  }
};

export const showInfoAllUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getInfoAllUsersByRole(String(req.query.role));
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const showInfoUserByRoleAndId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getInfoOneUserByRoleAndId(String(req.query.role), req.params.id);
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await blockUserById(req.params.id, req.body.reason);
    res.status(200).json({ Message: `User with id #${req.params.id} is blocked.` });
  } catch (err) {
    next(err);
  }
};

export const unbanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await unblockUserById(req.params.id, req.body.reason);
    res.status(200).json({ Message: `User with id #${req.params.id} is unblocked.` });
  } catch (err) {
    next(err);
  }
};
