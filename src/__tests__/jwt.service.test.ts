import { sequelize } from "../sequelize";
import {
  generateAccessToken,
  generateRefreshToken,
  removeRefreshToken,
  saveRefreshTokenInDb,
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/jwt.service";
import jwt from "jsonwebtoken";

describe("Function generateAccessToken:", () => {
  test("Should generate access token.", async () => {
    const email = "email@gmail.com";
    const timeAccesssToken = "1h";
    const accessToken = await generateAccessToken(email, timeAccesssToken);
    const decodedAccessInfo = jwt.decode(accessToken);
    const verifyAccessToken = jwt.verify(accessToken, `${process.env.ACCESS_SECRET_KEY}`);
    expect(decodedAccessInfo).toStrictEqual(verifyAccessToken);
  });
});

describe("Function generateRefreshToken:", () => {
  test("Should generate refresh token.", async () => {
    const email = "email@gmail.com";
    const timeRefreshToken = "1h";
    const refreshToken = await generateRefreshToken(email, timeRefreshToken);
    const decodedRefreshInfo = jwt.decode(refreshToken);
    const verifyRefreshToken = jwt.verify(refreshToken, `${process.env.REFRESH_SECRET_KEY}`);
    expect(decodedRefreshInfo).toStrictEqual(verifyRefreshToken);
  });
});

describe("Function saveToken:", () => {
  test("Should save user's refresh token in db.", async () => {
    const userId = 1;
    const testRefreshToken = "testRefreshToken";
    const refresh = await saveRefreshTokenInDb(userId, testRefreshToken);
    expect(refresh).toStrictEqual([1]);
  });
});

describe("Function removeRefreshToken:", () => {
  test("Should remove user's refresh token in db.", async () => {
    const testRefreshToken = "testRefreshToken";
    const refresh = await removeRefreshToken(testRefreshToken);
    expect(refresh).toStrictEqual([1]);
  });
});

describe("Function verifyRefreshToken:", () => {
  test("Should verify refresh token.", async () => {
    const testData = {
      email: "testdata@gmail.com",
    } as const;
    const refreshToken = jwt.sign({ testData }, `${process.env.REFRESH_SECRET_KEY}`, { expiresIn: "30d" });
    const decodedRefreshToken = jwt.decode(refreshToken);
    const verifiedRefreshToken = await verifyRefreshToken(refreshToken);
    expect(decodedRefreshToken).toStrictEqual(verifiedRefreshToken);
  });
});

describe("Function verifyAccessToken:", () => {
  test("Should verify access token.", async () => {
    const testData = {
      email: "testdata@gmail.com",
    } as const;
    const accessToken = jwt.sign({ testData }, `${process.env.ACCESS_SECRET_KEY}`, { expiresIn: "2h" });
    const decodedAccessToken = jwt.decode(accessToken);
    const verifiedAccessToken = await verifyAccessToken(accessToken);
    expect(decodedAccessToken).toStrictEqual(verifiedAccessToken);
  });
});

afterAll((done) => {
  sequelize.close();
  done();
});
