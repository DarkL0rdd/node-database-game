import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { CustomError } from "./error.service";

const userSequelize = sequelize.getRepository(User);

/**
 * Generates JWT access token for user.
 * @param reqEmail User's email.
 * @param timeAccess JWT access token expiration time.
 * @returns Promise string JWT access token.
 * @throws `CustomError` if JWT access token generation error.
 */
export const generateAccessToken = async (reqEmail: string, timeAccess: string) => {
  try {
    return jwt.sign({ reqEmail }, `${process.env.ACCESS_SECRET_KEY}`, { expiresIn: timeAccess });
  } catch (err) {
    throw new CustomError(500, "Error generate access token."); // throw new CustomError(500, "Server error.");
  }
};

/**
 * Generates JWT refresh token for user.
 * @param reqEmail User's email.
 * @param timeRefresh JWT refresh token expiration time.
 * @returns Promise string JWT refresh token.
 * @throws `CustomError` if JWT refresh token generation error.
 */
export const generateRefreshToken = async (reqEmail: string, timeRefresh: string) => {
  try {
    return jwt.sign({ reqEmail }, `${process.env.REFRESH_SECRET_KEY}`, { expiresIn: timeRefresh });
  } catch (err) {
    throw new CustomError(500, "Error generate refresh token."); // throw new CustomError(500, "Server error.");
  }
};

/**
 * Saving JWT refresh token in the database.
 * @param reqUserId User's id.
 * @param refreshToken JWT refresh token.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 * @throws `CustomError` if `refreshToken` not found, or `affectedRow` is not equal to one(`1`).
 */
export const saveRefreshTokenInDb = async (reqUserId: number, refreshToken: string) => {
  const affectedRow = await userSequelize.update(
    { refresh_token: refreshToken },
    {
      where: { id: reqUserId },
    }
  );
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error save refresh token."); // throw new CustomError(500, "Server error.");
};

/**
 * Removing JWT refresh token from database.
 * @param refreshTokenFromDb JWT refresh token from database.
 * @returns Promise an array of one element. The first element is the number of affected rows.
 * @throws `CustomError` if `refreshTokenFromDb` not found in the database, or `affectedRow` is not equal to one(`1`).
 */
export const removeRefreshToken = async (refreshTokenFromDb: string) => {
  const affectedRow = await userSequelize.update(
    { refresh_token: null },
    {
      where: { refresh_token: refreshTokenFromDb },
    }
  );
  if (affectedRow[0] === 1) return affectedRow;
  throw new CustomError(500, "Error remove refresh token."); // throw new CustomError(500, "Server error.");
};

/**
 * Validates if JWT refresh token is valid.
 * @param refreshToken JWT refresh token from database.
 * @returns Promise JWTPayload if JWT `refreshToken` is valid.
 * @throws `CustomError` if JWT `refreshToken` is not valid.
 */
export const verifyRefreshToken = async (refreshToken: string) => {
  //authenticateRefreshToken
  try {
    return jwt.verify(refreshToken, `${process.env.REFRESH_SECRET_KEY}`);
  } catch (err) {
    console.log(err);
    throw new CustomError(403, "Error verify refresh token.");
  }
};

/**
 * Validates if JWT access token is valid.
 * @param accessToken JWT access token from database.
 * @returns Promise JWTPayload if JWT `accessToken` is valid.
 */
export const verifyAccessToken = async (accessToken: string) => {
  //authenticateAccessToken
  try {
    return jwt.verify(accessToken, `${process.env.ACCESS_SECRET_KEY}`);
  } catch (err) {
    console.log(err);
  }
};
