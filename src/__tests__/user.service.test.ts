import { User } from "../models/user.model";
import { sequelize } from "../sequelize";
import {
  blockUserById,
  createUser,
  getInfoAllUsersByRole,
  getInfoOneUserByRoleAndId,
  getInfoUserProfile,
  unblockUserById,
} from "../services/user.service";

describe("Function createUser:", () => {
  test("Should create new user in db.", async () => {
    const userObj = {
      first_name: "NewFirstName",
      role_id: 3,
      second_name: "NewSecondName",
      email: "new_email@gmail.com",
      password: "new_password",
      status: "Active",
    };
    const newUser = await createUser(userObj);
    expect(newUser).toMatchObject({
      first_name: userObj.first_name,
      role_id: userObj.role_id,
      second_name: userObj.second_name,
      email: userObj.email,
      password: newUser.password,
      status: userObj.status,
    });
  });
});

describe("Function getInfoUserProfile:", () => {
  test("Should find user in db and show his info.", async () => {
    const correctUserEmail = "test2@gmail.com";
    const userInfo = await getInfoUserProfile(correctUserEmail);
    const objUser = {
      first_name: userInfo.first_name,
      role: { role_name: userInfo.role.role_name },
      second_name: userInfo.second_name,
      email: userInfo.email,
    };
    expect(objUser).toEqual({
      first_name: "Test2",
      second_name: "Test2",
      email: "test2@gmail.com",
      role: { role_name: "Player" },
    });
  });

  test("Should throw error if user email is not found in db.", async () => {
    const wrongUserEmail = "wrong_user_email@gmail.com";
    let errObj = undefined;
    try {
      const userInfo = await getInfoUserProfile(wrongUserEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "User not found." });
  });
});

describe("Function changeInfoUserProfile:", () => {});

describe("Function getInfoAllUsersByRole:", () => {
  test("Should find all users in db and show his info.", async () => {
    const roleName = "Player";
    const usersInfo = await getInfoAllUsersByRole(roleName);
    expect(usersInfo.length).toBeGreaterThan(0);
    const userProperty = [
      "id",
      "role_id",
      "team_id",
      "first_name",
      "second_name",
      "email",
      "status",
      "reason",
      "createdAt",
      "updatedAt",
      "role",
    ];
    const roleProperty = ["id", "role_name", "createdAt", "updatedAt"];
    for (let i = 0; i < usersInfo.length; i++) {
      for (let j = 0; j < userProperty.length; j++) {
        expect(usersInfo[i]).toHaveProperty(userProperty[j]);
        for (let k = 0; k < roleProperty.length; k++) {
          expect(usersInfo[i].role).toHaveProperty(roleProperty[k]);
        }
      }
    }
  });

  test("Should throw error if users are not found in db.", async () => {
    const wrongRoleName = "wrong_role_name";
    let errObj = undefined;
    try {
      const usersInfo = await getInfoAllUsersByRole(wrongRoleName);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "Users not found." });
  });
});

describe("Function getInfoOneUserByRoleAndId:", () => {
  test("Should find user in db.", async () => {
    const roleName = "Player";
    const userId = "3";
    const userInfo = await getInfoOneUserByRoleAndId(roleName, userId);
    expect(userInfo).toBeDefined();

    const objUser = JSON.parse(JSON.stringify(userInfo));
    const userProperty = [
      "id",
      "role_id",
      "team_id",
      "first_name",
      "second_name",
      "email",
      "status",
      "reason",
      "createdAt",
      "updatedAt",
      "role",
    ];
    const roleProperty = ["id", "role_name", "createdAt", "updatedAt"];
    for (let i = 0; i < userProperty.length; i++) {
      expect(objUser).toHaveProperty(userProperty[i]);
      for (let j = 0; j < roleProperty.length; j++) {
        expect(objUser.role).toHaveProperty(roleProperty[j]);
      }
    }
  });

  test("Should throw error if user is not found in db.", async () => {
    const roleName = "Player";
    const wrongUserId = "255";
    let errObj = undefined;
    try {
      const userInfo = await getInfoOneUserByRoleAndId(roleName, wrongUserId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "User not found." });
  });
});

describe("Function blockUserById:", () => {
  test("Should block user in db.", async () => {
    const userId = "3";
    const affectedRow = await blockUserById(userId);
    expect(affectedRow[0]).toBeGreaterThan(0);
  });

  test("Should throw error if user is not found in db.", async () => {
    const wrongUserId = "255";
    let errObj = undefined;
    try {
      const affectedRow = await blockUserById(wrongUserId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "Error block user." });
  });
});

describe("Function unblockUserById:", () => {
  test("Should block user in db.", async () => {
    const userId = "3";
    const affectedRow = await unblockUserById(userId);
    expect(affectedRow[0]).toBeGreaterThan(0);
  });

  test("Should throw error if user is not found in db.", async () => {
    const userId = "255";
    let errObj = undefined;
    try {
      const affectedRow = await unblockUserById(userId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "Error unblock user." });
  });
});

const userSequelize = sequelize.getRepository(User);

afterAll((done) => {
  userSequelize
    .destroy({
      where: {
        first_name: "NewFirstName",
        second_name: "NewSecondName",
        email: "new_email@gmail.com",
      },
    })
    .then(() => {
      sequelize.close();
      done();
    });
});
//sequelize.close();
//done()
