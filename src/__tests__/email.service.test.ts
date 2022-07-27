import { sequelize } from "../sequelize";
import { findUserEmail } from "../services/email.service";

describe("Function findUserEmail:", () => {
  test("Should find user's email and id in db.", async () => {
    const correctEmail = "test2@gmail.com";
    const userInfo = await findUserEmail(correctEmail);
    expect(userInfo).toEqual({ email: `${correctEmail}`, id: 3 });
  });

  test("Should throw error if user's email is not found in db.", async () => {
    const wrongEmail = "wrong_email@gmail.com";
    let errObj = undefined;
    try {
      const userInfo = await findUserEmail(wrongEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 401, message: `User with email ${wrongEmail} is not found.` });
  });
});

afterAll((done) => {
  //Closing the DB connection allows Jest to exit successfully.
  sequelize.close();
  done();
});
