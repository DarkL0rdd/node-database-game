import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
const jwt = require("jsonwebtoken");

const userSequelize = sequelize.getRepository(User);

export const generateToken = (
  reqEmail: string,
  timeAccesss: string,
  timeRefresh: string
) => {
  try {
    const payload: object = { reqEmail };
    const accessToken: string = jwt.sign(
      payload,
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: timeAccesss,
      }
    );
    const refreshToken: string = jwt.sign(
      payload,
      process.env.REFRESH_SECRET_KEY,
      {
        expiresIn: timeRefresh,
      }
    );
    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
};

export const saveToken = async (reqUserId: number, refreshToken: string) => {
  try {
    const userId = await userSequelize.findOne({ where: { id: reqUserId } });
    if (userId) {
      userId.refresh_token = refreshToken;
      return userId.save();
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeToken = async (refreshToken: string) => {
  try {
    await userSequelize.update(
      { refresh_token: "null" },
      {
        where: { refresh_token: refreshToken },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const authenticateAccessToken = async (token: string) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const authenticateRefreshToken = async (token: string) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (err) {
    console.log(err);
    return null;
  }
};
