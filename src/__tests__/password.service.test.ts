import { sequelize } from "../sequelize";
import bcrypt from "bcryptjs";
import { compareUserPassword, hashUserPassword, saveNewUserPassword } from "../services/password.service";

describe("Function hashUserPassword:", () => {
  test("Should hash user's password.", async () => {
    const userPassword = "correct_password";
    const salRounds = 8;
    const hashedPassword = await hashUserPassword(userPassword, salRounds);
    const hashCompare: boolean = bcrypt.compareSync(userPassword, hashedPassword);
    expect(hashCompare).toBe(true);
  });
});

describe("Function compareUserPassword:", () => {
  test("Should throw error if user's email is wrong.", async () => {
    const wrongEmail = "wrong_email@gmail.com";
    const password = "wrong_password";
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
    const correctEmail = "test2@gmail.com";
    const wrongPassword = "wrong_password";
    let errObj = undefined;
    try {
      await compareUserPassword(correctEmail, wrongPassword);
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
    const wrongEmail = "wrong_email@gmail.com";
    const password = "random_password";
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
    const password = "testtest2";
    const savePass = await saveNewUserPassword(password, email);
    expect(savePass).toEqual([1]);
  });
});

afterAll((done) => {
  sequelize.close();
  done();
});
