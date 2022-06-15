import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const userSequelize = sequelize.getRepository(User);

export const generateAccessToken = async (reqEmail: string, timeAccesss: string) => {
  try {
    const accessToken = jwt.sign({ reqEmail }, `${process.env.ACCESS_SECRET_KEY}`, { expiresIn: timeAccesss });
    return accessToken;
  } catch (err) {
    console.log(err);
  }
};

export const generateRefreshToken = async (reqEmail: string, timeRefresh: string) => {
  try {
    const refreshToken = jwt.sign({ reqEmail }, `${process.env.REFRESH_SECRET_KEY}`, { expiresIn: timeRefresh });
    return refreshToken;
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
    return await userSequelize.update(
      { refresh_token: undefined },
      {
        where: { refresh_token: refreshToken },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const verifyRefreshToken = async (refreshToken: string) => {
  //authenticateRefreshToken
  try {
    return jwt.verify(refreshToken, `${process.env.REFRESH_SECRET_KEY}`);
    //let payloadUser;
    //payloadUser = jwt.verify(refreshToken, `${process.env.REFRESH_SECRET_KEY}`);
    /*jwt.verify(refreshToken, `${process.env.REFRESH_SECRET_KEY}`, (err, payload) => {
      if (err) {
        console.log(err);
        //payloadUser = false;
      } else {
        payloadUser = payload;
      }
    });*/
    //return payloadUser;
  } catch (err) {
    console.log(err);
  }
};

export const verifyAccessToken = async (accessToken: string) => {
  //authenticateAccessToken
  try {
    return jwt.verify(accessToken, `${process.env.ACCESS_SECRET_KEY}`);
    //let payloadUser;
    //payloadUser = jwt.verify(accessToken, `${process.env.ACCESS_SECRET_KEY}`);
    /*jwt.verify(accessToken, `${process.env.ACCESS_SECRET_KEY}`, (err, payload) => {
      if (err) {
        console.log(err);
        //payloadUser = false;
      } else {
        payloadUser = payload;
      }
    });*/
    //return payloadUser;
  } catch (err) {
    console.log(err);
  }
};
