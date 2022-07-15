import { sequelize } from "../sequelize";
import bcrypt from "bcryptjs";
import { compareUserPassword, hashUserPassword, saveNewUserPassword } from "../services/password.service";

describe("Function hashUserPassword:", () => {
  test("Should hash user's password.", async () => {
    const userPassword = "password";
    const salRounds = 8;
    const hashedPassword = await hashUserPassword(userPassword, salRounds);
    const hashCompare: boolean = bcrypt.compareSync(userPassword, hashedPassword);
    expect(hashCompare).toBe(true);
  });
});

describe("Function compareUserPassword:", () => {
  test("Should throw error if user's email is wrong.", async () => {
    const wrongEmail = "I_DON'T_EXIST@gmail.com";
    const password = "test6";
    let errObj = undefined;
    try {
      await compareUserPassword(wrongEmail, password);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 401, message: "Email is incorrect." });
  });

  test("Should throw error if user's password is wrong.", async () => {
    const email = "test6@gmail.com";
    const wrongPassword = "test";
    let errObj = undefined;
    try {
      await compareUserPassword(email, wrongPassword);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 403, message: "Password is incorrect." });
  });
});

//describe("Function generateLinkEmail:", () => {});

describe("Function saveNewUserPassword:", () => {
  test("Should throw error if user's email is wrong.", async () => {
    const wrongEmail = "I_DON'T_EXIST@gmail.com";
    const password = "test6";
    let errObj = undefined;
    try {
      await saveNewUserPassword(password, wrongEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "Error save new password." });
  });

  test("Should save new user's password in db.", async () => {
    const email = "test2@gmail.com";
    const password = "test2";
    const savePass = await saveNewUserPassword(password, email);
    expect(savePass).toEqual([1]);
  });
});

afterAll((done) => {
  sequelize.close();
  done();
});
