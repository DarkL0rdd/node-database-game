import { sequelize } from "../sequelize";
import { findUserEmail, compareUserEmail } from "../services/email.service";
import { CustomError } from "../services/error.service";

describe("findUserEmail", () => {
  test("Should find user email and id", async () => {
    const findEmail = "test2@gmail.com";
    const userInfo = await findUserEmail(findEmail);
    expect(userInfo).toEqual({ email: `${findEmail}`, id: 2 });
  });

  test("Should throw error when user email not found", async () => {
    const findEmail = "test25@gmail.com";
    let errObj = undefined;
    let userInfo = undefined;
    try {
      userInfo = await findUserEmail(findEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 401, message: `User with email ${findEmail} is not found.` });
  });
});

describe("compareUserEmail", () => {});

afterAll((done) => {
  //Closing the DB connection allows Jest to exit successfully.
  sequelize.close();
  done();
});
