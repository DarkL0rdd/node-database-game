import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);

export const generateAccessToken = async (reqEmail: string, timeAccesss: string) => {
  try {
    return jwt.sign({ reqEmail }, `${process.env.ACCESS_SECRET_KEY}`, { expiresIn: timeAccesss });
  } catch (err) {
    throw new CustomError(500, "Error generate access token."); // throw new CustomError(500, "Server error.");
  }
};

export const generateRefreshToken = async (reqEmail: string, timeRefresh: string) => {
  try {
    return jwt.sign({ reqEmail }, `${process.env.REFRESH_SECRET_KEY}`, { expiresIn: timeRefresh });
  } catch (err) {
    throw new CustomError(500, "Error generate refresh token."); // throw new CustomError(500, "Server error.");
  }
};

export const saveToken = async (reqUserId: number, refreshToken: string) => {
  try {
    return await userSequelize.update(
      { refresh_token: refreshToken },
      {
        where: { id: reqUserId },
      }
    );
  } catch (err) {
    throw new CustomError(500, "Error save token."); // throw new CustomError(500, "Server error.");
  }
};

export const removeRefreshToken = async (refreshTokenFromDb: string) => {
  try {
    return await userSequelize.update(
      { refresh_token: null },
      {
        where: { refresh_token: refreshTokenFromDb },
      }
    );
  } catch (err) {
    throw new CustomError(500, "Error remove refresh token."); // throw new CustomError(500, "Server error.");
  }
};

export const verifyRefreshToken = async (refreshToken: string) => {
  //authenticateRefreshToken
  try {
    return jwt.verify(refreshToken, `${process.env.REFRESH_SECRET_KEY}`);
  } catch (err) {
    console.log(err);
    //throw new CustomError(403, "Error verify refresh token.");
  }
};

export const verifyAccessToken = async (accessToken: string) => {
  //authenticateAccessToken
  try {
    return jwt.verify(accessToken, `${process.env.ACCESS_SECRET_KEY}`);
  } catch (err) {
    console.log(err);
    //throw new CustomError(403, "Error verify access token.");
  }
};
