import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);

export const generateAccessToken = async (reqEmail: string, timeAccesss: string) => {
  const accessToken = jwt.sign({ reqEmail }, `${process.env.ACCESS_SECRET_KEY}`, { expiresIn: timeAccesss });
  if (!accessToken) throw new CustomError(500, "Error generate access token.");
  return accessToken;
};

export const generateRefreshToken = async (reqEmail: string, timeRefresh: string) => {
  const refreshToken = jwt.sign({ reqEmail }, `${process.env.REFRESH_SECRET_KEY}`, { expiresIn: timeRefresh });
  if (!refreshToken) throw new CustomError(500, "Error generate refresh token.");
  return refreshToken;
};

export const saveToken = async (reqUserId: number, refreshToken: string) => {
  const userId = await userSequelize.findOne({ where: { id: reqUserId } });
  if (!userId) throw new CustomError(404, "User not found.");
  userId.refresh_token = refreshToken;
  return userId.save();
};

export const removeRefreshToken = async (refreshTokenFromDb: string) => {
  return await userSequelize.update(
    { refresh_token: undefined },
    {
      where: { refresh_token: refreshTokenFromDb },
    }
  );
};

export const verifyRefreshToken = async (refreshToken: string) => {
  //authenticateRefreshToken
  try {
    return jwt.verify(refreshToken, `${process.env.REFRESH_SECRET_KEY}`);
  } catch (err) {
    console.log(err);
  }
};

export const verifyAccessToken = async (accessToken: string) => {
  //authenticateAccessToken
  try {
    return jwt.verify(accessToken, `${process.env.ACCESS_SECRET_KEY}`);
  } catch (err) {
    console.log(err);
  }
};
